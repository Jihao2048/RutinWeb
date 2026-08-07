//ALL RIGHTS RESERVED 保留所有权利 未经允许不得复制、修改、分发或销售本软件的副本
if (document.referrer.includes('jihao.icu')) {
    alert('记住新的域名！');
}

// 音乐播放器相关功能
let selectedMenuItem = -1;
const audio = document.getElementById('bgm');
const audioControl = document.getElementById('audio-control');
const playbackStatus = document.getElementById('playback-status');
const optionSound = document.getElementById('option-sound');
let lyricsData = [];
let lastLyric = "";
let hideTimeout = null;

// 导航状态管理
let currentView = 'main';
let currentArticleId = '';
const backButton = document.getElementById('back-button');
const menu = document.querySelector('.menu');

// 获取歌词数据 (回退到旧版逻辑)
async function fetchLyrics() {
    try {
        if (!audio.src) {
            audio.src = `https://music.163.com/song/media/outer/url?id=${MusicId}.mp3`;
        }
        const response = await fetch(`https://apis.netstart.cn/music/lyric?id=${MusicId}`);
        const data = await response.json();
        if (data.lrc && data.lrc.lyric) {
            parseLyrics(data.lrc.lyric);
        }
    } catch (error) {
        console.error('获取歌词失败:', error);
    }
}

// 解析歌词 (回退到旧版逻辑)
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

// 更新歌词显示 (回退到旧版逻辑)
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

// 显示播放状态和歌词 (回退到旧版逻辑)
function showPlaybackStatus(message, lyric = "") {
    const statusText = document.getElementById('status-text');
    const lyricText = document.getElementById('lyric-text');
    statusText.textContent = message;
    statusText.style.color = 'black'; // 旧版强制设为黑色
    lyricText.textContent = lyric;
    clearTimeout(hideTimeout);
    playbackStatus.classList.remove('show');
    void playbackStatus.offsetWidth; // 触发重绘以重新播放动画
    playbackStatus.classList.add('show');
    hideTimeout = setTimeout(() => {
        playbackStatus.classList.remove('show');
    }, 2000);
}

// 播放/暂停控制 (结合旧版逻辑与新版报错处理)
function togglePlayPause() {
    playInteractionSound();
    if (audio.paused) {
        if (!audio.src) {
            audio.src = `https://music.163.com/song/media/outer/url?id=${MusicId}.mp3`;
        }
        audio.play().catch(e => {
            console.error("自动播放失败:", e);
            showPlaybackStatus('播放失败，请检查网络或稍后重试', '');
        });
        audioControl.classList.add('playing');
        audioControl.classList.remove('paused');
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

function playInteractionSound() {
    if (optionSound) {
        optionSound.parentElement && optionSound.currentTime !== undefined && (optionSound.currentTime = 0);
        optionSound.play().catch(() => {});
    }
}

function generateAllArticles() {
    if (typeof articles === 'undefined' || articles.length === 0) return '<p class="no-articles">暂无文章</p>';
    return articles.map(article => `
    <div class="article-item" onclick="showArticleMain('${article.id}')">
        <h4>${article.title}</h4>
        <span class="article-date">${article.date}</span>
    </div>
    `).join('');
}

function generateFriendLinks() {
    if (typeof friendLinks === 'undefined' || friendLinks.length === 0) return '<p class="no-articles">暂无友链</p>';
    return friendLinks.map(link => `
    <a href="${link.url}" target="_blank" class="friend-link-card">
        <div class="avatar">
            <img src="${link.avatar}" alt="${link.name}" onerror="this.style.display='none'">
        </div>
        <div class="info">
            <div class="name">${link.name}</div>
            <div class="description">${link.description}</div>
        </div>
    </a>
    `).join('');
}

function generateGitHubProjects() {
    if (typeof githubProjects === 'undefined' || githubProjects.length === 0) return '<p class="no-articles">暂无项目</p>';
    return githubProjects.map(project => `
    <a href="${project.url}" target="_blank" class="project-card">
        <div class="info">
            <div class="name">${project.name} <span class="project-lang"># ${project.language}</span></div>
            <div class="description">${project.description}</div>
        </div>
    </a>
    `).join('');
}

function loadContent(index) {
    const contentItems = document.querySelectorAll('.content-item');
    if (!contentItems[index]) return;
    contentItems.forEach((item, i) => {
        if(i === index) {
            item.classList.add('active');
            item.innerHTML = contentData[index].content;
        } else {
            item.classList.remove('active');
        }
    });
    updateNavigation('main', '', true);
}

async function showArticleMain(articleId) {
    playInteractionSound();
    const contentItem = document.querySelectorAll('.content-item')[0];
    const article = articles.find(a => a.id === articleId);
    if (article) {
        contentItem.innerHTML = `
        <div class="article-detail-container">
            <div class="article-header">
                <h2>${article.title}</h2>
                <span class="article-date">${article.date}</span>
            </div>
            <div class="article-content">
                <p>加载中...</p>
            </div>
        </div>
        `;
        try {
            const response = await fetch(article.file);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;
            contentItem.innerHTML = `
            <div class="article-detail-container">
                <div class="article-header">
                    <h2>${article.title}</h2>
                    <span class="article-date">${article.date}</span>
                </div>
                <div class="article-content">${bodyContent}</div>
            </div>
            `;
            document.title = article.title;
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('name', articleId);
            window.history.pushState({}, '', newUrl);
        } catch (error) {
            console.error('加载文章失败:', error);
            contentItem.innerHTML = `
            <div class="article-detail-container">
                <div class="article-header">
                    <h2>${article.title}</h2>
                    <span class="article-date">${article.date}</span>
                </div>
                <div class="article-content">
                    <p>加载失败，请稍后重试</p>
                </div>
            </div>
            `;
        }
        updateNavigation('article-detail', articleId);
    }
}

function updateNavigation(view, articleId = '', clearUrl = false) {
    currentView = view;
    currentArticleId = articleId;
    if (currentView === 'main') {
        backButton.classList.remove('show');
    } else {
        backButton.classList.add('show');
    }
    document.querySelector('.content').scrollTop = 0;
    if (clearUrl) {
        window.history.pushState({}, '', window.location.pathname);
    } else if (view !== 'main') {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('name', articleId);
        window.history.pushState({}, '', newUrl);
    }
}

function goBack() {
    playInteractionSound();
    if (currentView === 'article-detail') {
        loadContent(0);
        document.title = '鸡仔个人网站';
        window.history.pushState({}, '', window.location.pathname);
    }
}

function selectMenuItem(index) {
    playInteractionSound();
    const menuItems = document.querySelectorAll('.menu-item:not(.back-button)');
    menuItems.forEach((item, i) => {
        item.classList.toggle('selected', i === index);
    });
    selectedMenuItem = index;
    loadContent(index);
    if (window.innerWidth <= 768) {
        menu.classList.remove('active');
    }
}

// 初始化音频事件监听 (仅保留旧版必要的监听)
audio.addEventListener('timeupdate', updateLyrics);

const menuBtn = document.querySelector('.menu-button');
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove('active');
    }
});

let clickCounter = 0;
document.querySelector('.image-container').addEventListener('click', () => {
    clickCounter++;
    if (clickCounter % 6 === 0) {
        if (typeof surprise !== 'undefined' && surprise.length > 0) {
            const item = surprise[Math.floor(Math.random() * surprise.length)];
            alert(`\n${item.content.replace(/<br>/g, '\n')}`);
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleName = urlParams.get('name');
    const aboutParam = urlParams.get('about');
    if (aboutParam === 'true') {
        selectMenuItem(1);
    } else if (articleName) {
        const article = articles.find(a => a.id === articleName);
        if (article) {
            selectMenuItem(0);
            setTimeout(() => {
                showArticleMain(article.id);
            }, 100);
        } else {
            selectMenuItem(0);
        }
    } else {
        selectMenuItem(0);
    }
});

function 关闭背景图() {
    document.querySelector('.bg-header').style.display = 'none';
}

function 荆南麦圆体() {
    document.documentElement.style.setProperty('--main-font', '荆南麦圆体, sans-serif');
    var fontStyle = document.createElement('style');
    document.head.appendChild(fontStyle);
}

function 谷歌字() {
    document.documentElement.style.setProperty('--main-font', "'Google Sans', 'Roboto', sans-serif");
}

//内容区域
const contentData = [
    {
        title: "经验分享",
        content: `
        <div class="main-layout">
            <div class="announcement-panel">
                <h2>📢 公告</h2>
                <div class="announcement-content">
                    <p>欢迎来到鸡仔的个人网站！</p>
                    <p><a href="https://vibe.ias1054.cn" target="_blank">点击这里</a>查看鸡仔的VibeCode展馆，展示如何使用AI生成代码。</p>
                    <h3>联系方式</h3>
                    <a href="https://qm.qq.com/q/q8QHoWWr6g" target="_blank" class="contact-link">点击链接加入“鸡好的QQ群聊”</a>
                    <br>
                    <p>点击菜单栏图标六次有惊喜！弹出内容已经更新一遍，欢迎探索。</p>
                    <p>&copy; 2026 All Rights Reserved</p>
                </div>
            </div>
            <div class="articles-panel">
                <h2>📚 文章列表</h2>
                <div class="all-articles-list">${generateAllArticles()}</div>
            </div>
        </div>
        `
    },
    {
        title: "友情链接",
        content: `
        <div class="main-layout">
            <div class="friend-links-panel">
                <h2>🔗 友情链接</h2>
                <div class="friend-links-list">${generateFriendLinks()}</div>
            </div>
            <div class="projects-panel">
                <h2>📦 GitHub 项目</h2>
                <div class="projects-list">${generateGitHubProjects()}</div>
            </div>
        </div>
        `
    }
];

const MusicId = "3401557944";
//https://music.163.com/song?id=3401557944&uct2=U2FsdGVkX18BBPHeZxgXKBfMMQBMvtRuDamI7OZMWlk=