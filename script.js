// 音乐播放器相关功能
let selectedMenuItem = -1;
const audio = document.getElementById('bgm');
const audioControl = document.getElementById('audio-control');
const playbackStatus = document.getElementById('playback-status');
const optionSound = document.getElementById('option-sound');
let lyricsData = [];
let lastLyric = "";
let hideTimeout = null;
let MusicId = "1979417838"; 

// 获取歌词数据
async function fetchLyrics() {
    try {
        if (!audio.src) { // 新增判断
            audio.src = `https://api.injahow.cn/meting/?type=url&id=${MusicId}`;
        }
        const response = await fetch(`https://apis.netstart.cn/music/lyric?id=${MusicId}`);
        const data = await response.json();
        parseLyrics(data.lrc.lyric);
    } catch (error) {
        console.error('获取歌词失败:', error);
    }
}

// 解析歌词
function parseLyrics(lrcText) {
    const lines = lrcText.split('\n');
    lyricsData = [];
    
    lines.forEach(line => {
        const timeMatch = line.match(/\[(\d+):(\d+)\.(\d+)\]/);
        if (timeMatch) {
            const minutes = parseInt(timeMatch[1]);
            const seconds = parseInt(timeMatch[2]);
            const milliseconds = parseInt(timeMatch[3]);
            const time = minutes * 60 + seconds + milliseconds / 1000;
            
            const text = line.replace(/\[\d+:\d+\.\d+\]/g, '').trim();
            if (text) {
                lyricsData.push({ time, text });
            }
        }
    });
    
    // 按时间排序
    lyricsData.sort((a, b) => a.time - b.time);
}

// 更新歌词显示
function updateLyrics() {
    if (audio.paused) return;
    
    const currentTime = audio.currentTime;
    let currentLyric = "";
    let found = false;
    
    // 找到当前应该显示的歌词
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) {
            currentLyric = lyricsData[i].text;
            found = true;
        } else if (found) {
            break;
        }
    }
    
    // 只有当歌词变化时才触发更新
    if (currentLyric !== lastLyric) {
        lastLyric = currentLyric;
        showPlaybackStatus("♪ 正在播放 ♪", currentLyric);
    }
}

// 显示播放状态和歌词
function showPlaybackStatus(message, lyric = "") {
    const statusText = document.getElementById('status-text');
    const lyricText = document.getElementById('lyric-text');
    
    statusText.textContent = message;
    statusText.style.color = 'black';
    lyricText.textContent = lyric;
    
    clearTimeout(hideTimeout);
    playbackStatus.classList.remove('show');
    void playbackStatus.offsetWidth;
    playbackStatus.classList.add('show');
    
    hideTimeout = setTimeout(() => {
        playbackStatus.classList.remove('show');
    }, 2000);
}

// 播放/暂停控制
function togglePlayPause() {
    if (audio.paused) {
        if (!audio.src) { // 新增音频初始化
            audio.src = `https://api.injahow.cn/meting/?type=url&id=${MusicId}`;
        }
        audio.play();
        audioControl.classList.add('playing');
        audioControl.classList.remove('paused');
        showPlaybackStatus('♪ 正在播放 ♪');
        
        if (lyricsData.length === 0) {
            fetchLyrics();
        }
    } else {
        audio.pause();
        audioControl.classList.remove('playing');
        audioControl.classList.add('paused');
        showPlaybackStatus('已暂停');
        lastLyric = "";
    }
}

// 初始化音频事件监听
audio.addEventListener('timeupdate', updateLyrics);

// 修改菜单项点击事件绑定方式
document.querySelectorAll('.menu-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        selectMenuItem(index);
    });
});

// 选择菜单项
function selectMenuItem(index) {
    if (selectedMenuItem !== -1) {
        document.querySelectorAll('.menu-item')[selectedMenuItem].classList.remove('selected');
        document.querySelectorAll('.content-item')[selectedMenuItem].classList.remove('active');
    }
    selectedMenuItem = index;
    document.querySelectorAll('.menu-item')[index].classList.add('selected');
    document.querySelectorAll('.content-item')[index].classList.add('active');
    if (optionSound) {
        optionSound.currentTime = 0;
        optionSound.play();
    }
    
    // 新增：选择菜单项后自动隐藏菜单栏
    menu.classList.remove('active');
}

// 页面加载时自动显示菜单栏
window.addEventListener('DOMContentLoaded', () => {
    menu.classList.add('active');
});

// 汉堡菜单交互功能
const menuBtn = document.querySelector('.mobile-menu-btn');
const menu = document.querySelector('.menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('active');
});

document.querySelector('.content').addEventListener('click', () => {
  if (menu.classList.contains('active')) {
    menu.classList.remove('active');
  }
});

// 彩蛋效果
let clickCounter = 0;
document.querySelector('.image-container').addEventListener('click', () => {
  clickCounter++;
  
  if (clickCounter % 6 === 0) {
    const randomIndex = Math.floor(Math.random() * surprise.length);
    const content = surprise[randomIndex].content
      .replace(/<br>/, '\n');  // 转换换行符
    alert(`\n${content}`);
  }
});
