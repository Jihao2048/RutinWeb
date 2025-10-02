const DefaultColors = [    
    { hex: 'FF0000', name: '标准红色'},
    { hex: '00FF00', name: '标准绿色'},
    { hex: '0000FF', name: '标准蓝色'},
    { hex: '86EAC8', name: '薄荷绿' },
    { hex: 'A7F3D0', name: '淡翡翠' },
    { hex: 'A6E0CF', name: '淡绿' },
    { hex: 'F4C2C2', name: '淡玫瑰' },
    { hex: '01847F', name: '马尔斯' },
    { hex: 'FFD1DC', name: '嫩粉色' },
    { hex: 'CFE2F3', name: '浅灰蓝' },
    { hex: '87CEEB', name: '天蓝' },
    { hex: 'FFB7C5', name: '樱花粉' },
    { hex: 'EDF7FA', name: '月光蓝' }
];
//彩蛋效果
const surprise = [
    {number: 1, content: '关注永雏塔菲喵~'},
    {number: 2, content: '单生蛋🤬，大象爽🥵，蛋生蛋🤬，狼爽😫，诞生蛋🤬，老鹰爽🤪，我们独自消费🤑，蹿稀爽😱，单生蛋🤬，冰糖葫芦爽😫，单身蛋🤬，WhatcanIsay？😏，蛋生蛋🤬，鸽鸽爽，哈哈😫，诞生蛋😡， Jk妹爽🤤，我们独自消费🤑，钢管爽🥺，蛋身蛋🤬， 鸡蛋爽😎Ak爽🙏Mk24爽😊'},
    {number: 3, content: '这到底我滴妈是什么鬼东西我的妈啊我妈这到底是什么鬼东西我的妈我这是怎么什么我的天这到底是什么我的妈这到底是什么什么鬼东西我的天啊我去这到底我的妈啊我这到底是什么鬼东西我这去这到底是什么啊的妈妈咪我去我的妈妈这到底我滴妈是什么鬼东西我的妈啊妈这到底是什么鬼东西我的妈'},
    {number: 4, content: '就是加我吧四局夹娃娃机吧大喊大叫额别人叫我接收不到侃爷维斯特特特特特特特特特特解三角形BB额滴发红包逼鼻鼻金石为开人呢请问爱上对方过后就哭了角度发货时间鸡北京哔哔哔呵呵呵'},
    {number: 5, content: '距离世界崩坏还有十秒😱😱😱给我😡等等等等等等等等✋✋✋✋✋可我还怀着😰😰😰接下来和大家一起的勇气呢😄第101次借用这样的回忆👌🏻👌🏻👌🏻👌🏻因为快乐😁也好失败也好😫都从不消失世界 亲亲😘 未来 将一切最最喜欢的都紧紧抱住🤲🤲大家所有人人都能露出笑容💓💓的正确答案宿敌 逆境怪物 无论什么都欣然接受😌in冒失疯癫闪亮⭐⭐登场便是最强、真是让人费点心吧？'},
    {number: 6, content: '这怎么一半敖丙一半哪吒呀人家明明是哪吒华容道啊这敖丙混进来是怎么回事啊出去出去出去不要了不要了不要了你不要我要你要它干啥呀谁爱要谁要反正我这不要快看我命由我不由天所以啊这是哪吒华容道才不要敖丙进来呢'},
    {number: 7, content: '别吃我😭别吃我😱柠檬酸酸的😫酸酸的🥵 酸到你掉眼泪😄（磕到甲沟炎了）🆘🆘🆘'},
    {number: 8, content: '那么这一时刻又有老铁问了，杨哥杨哥，你的技术到底是怎么练的，那么好，老铁，我告诉你，有些东西，人一出生就有了，如果你出生没有，这辈子很难再次拥有，你们好，我是辽宁省最后一个金枪王，也是你们的男神💀 那凌厉的刀锋出寒冬 我静听那老人敲时钟 那传说中的不老松 在迎着雪间来的风 远处的高楼太繁华 无数的人群都往上爬 用贪婪自私的步伐 磨干净自己的爪牙 在斗争后的半边天 还弥漫着刺骨的硝烟 有人在后面踮脚尖 看前方身影敢当先'},
    {number: 9, content: '舞萌DX/ 中二节奏 登入二维码把下方二维码对准机台扫描处,可用机台有「舞萌DX） 和 「中二节奏）...」 扫码后，会自动跳转到对应游戏的登录界面，无需再次扫码。'},
    {number: 10, content: '𝘋𝘢𝘳𝘭𝘪𝘯𝘨 𝘩𝘰𝘭𝘥 𝘮𝘺 𝘩𝘢𝘯𝘥👬~🎵🔝𝙽𝚘𝚝𝚑𝚒𝚗𝚐 𝚋𝚎𝚊𝚝𝚜 𝚊 𝙹𝚎𝚝𝟸✈️ 𝚑𝚘𝚕𝚒𝚍𝚊𝚢🧳⛱️🪂𝙰𝚗𝚍 𝚛𝚒𝚐𝚑𝚝 𝚗𝚘𝚠⏰️🎉🎉🎉 𝚄🫵 𝚌𝚊𝚗 𝚜𝚊𝚟𝚎🏷£5️⃣0️⃣𝚙𝚎𝚛 𝚙𝚎𝚛𝚜𝚘𝚗 🛍𝚃𝚑𝚊𝚝’𝚜 £2️⃣0️⃣0️⃣ 𝚘𝚏 𝚏𝚘𝚛 𝚊 👨‍👨‍👦‍👦𝚏𝚊𝚖𝚒𝚕𝚢4️⃣🧾'}
]
const photodata = [
    {url:"image/1.JPG", shotwith:'iPhone SE 1st generation', date:'February 16, 2024 3:52 PM'},
    {url:"image/2.JPG", shotwith:'iPhone SE 2nd generation', date:'March 30, 2025 1:26 PM'},
    {url:"image/3.JPG", shotwith:'iPhone SE 2nd generation', date:'April 5, 2025 2:56 PM'},
    {url:"image/4.JPG", shotwith:'iPhone SE 2nd generation', date:'April 16, 2025 11:19 PM'},
    {url:"image/5.JPG", shotwith:'iPhone SE 2nd generation', date:'May 18, 2025 11:07 AM'},
    {url:"image/6.JPG", shotwith:'iPhone SE 2nd generation', date:'June 28, 2025 12:43 PM'}, 
    {url:"image/7.JPG", shotwith:'iPhone SE 1st generation', date:'July 19, 2024 6:45 PM'}, 
    {url:"image/8.JPG", shotwith:'iPhone SE 2nd generation', date:'August 22, 2025 7:23 PM'}, 
    {url:"image/9.JPG", shotwith:'iPhone SE 2nd generation', date:'August 23, 2025 10:55 AM'}, 
    {url:"image/10.jpg", shotwith:'OPPO K9 Pro 5G', date:'October 15, 2022 3:58 PM'}
];