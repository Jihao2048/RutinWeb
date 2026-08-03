import os
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image

# 尝试导入 pillow-heif 以支持 HEIF/HEIC 格式
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIF_SUPPORTED = True
except ImportError:
    HEIF_SUPPORTED = False

def remove_exif(input_path):
    """
    去除图片的EXIF信息并覆盖原文件
    """
    try:
        # 打开图片
        img = Image.open(input_path)
        
        # 获取原始格式
        original_format = img.format
        original_mode = img.mode
        
        # 创建不含EXIF的新图片
        data = list(img.getdata())
        img_without_exif = Image.new(original_mode, img.size)
        img_without_exif.putdata(data)
        
        # 处理调色板模式
        if img.mode == 'P':
            img_without_exif.putpalette(img.getpalette())
        
        # 保存临时文件
        temp_path = input_path + '.temp'
        
        # 根据格式设置保存参数
        save_kwargs = {}
        if original_format == 'JPEG':
            save_kwargs['quality'] = 95
            save_kwargs['optimize'] = True
        elif original_format == 'PNG':
            save_kwargs['optimize'] = True
        
        # 保存图片（不包含EXIF）
        img_without_exif.save(temp_path, format=original_format, **save_kwargs)
        
        # 关闭图片
        img.close()
        img_without_exif.close()
        
        # 删除原文件并重命名临时文件
        os.remove(input_path)
        os.rename(temp_path, input_path)
        
        return True, None
        
    except Exception as e:
        # 清理临时文件
        temp_path = input_path + '.temp'
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass
        return False, str(e)

def main():
    # 隐藏主窗口
    root = tk.Tk()
    root.withdraw()
    
    # 设置文件类型过滤器
    if HEIF_SUPPORTED:
        filetypes = [
            ("图片文件", "*.jpg *.jpeg *.png *.heif *.heic"),
            ("所有文件", "*.*")
        ]
    else:
        filetypes = [
            ("图片文件", "*.jpg *.jpeg *.png"),
            ("所有文件", "*.*")
        ]
    
    # 直接弹出文件选择对话框
    files = filedialog.askopenfilenames(
        title="选择要去除EXIF信息的图片",
        filetypes=filetypes
    )
    
    # 用户取消选择
    if not files:
        return
    
    # 处理文件
    success_count = 0
    fail_count = 0
    error_messages = []
    
    for file_path in files:
        filename = os.path.basename(file_path)
        success, error = remove_exif(file_path)
        
        if success:
            success_count += 1
        else:
            fail_count += 1
            error_messages.append(f"{filename}: {error}")
    
    # 显示结果
    if fail_count == 0:
        messagebox.showinfo(
            "完成",
            f"成功清除 {success_count} 个图片的EXIF信息！"
        )
    else:
        message = f"处理完成\n成功: {success_count} 个\n失败: {fail_count} 个\n\n"
        if error_messages:
            message += "失败详情:\n" + "\n".join(error_messages[:5])
            if len(error_messages) > 5:
                message += f"\n... 还有 {len(error_messages)-5} 个错误"
        messagebox.showwarning("完成", message)

if __name__ == "__main__":
    main()
