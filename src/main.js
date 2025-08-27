// src/main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/router.js'
import lazyLoad from '@/directives/lazyLoad.js'
import contentLoader from '@/services/contentLoader.js'
import searchService from '@/services/searchService.js'

const app = createApp(App)

// 移动端适配 - 处理地址栏影响
if ('virtualKeyboard' in navigator) {
    // 处理虚拟键盘对视口的影响
    navigator.virtualKeyboard.overlaysContent = true
}

// 或者使用 CSS 变量动态设置
function setMobileHeight() {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// 视频预加载工具函数
function preloadVideos(videoUrls) {
    const promises = videoUrls.map((url) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadeddata = () => resolve(url);
            video.onerror = () => reject(url);
            video.src = url;
        });
    });

    return Promise.allSettled(promises);
}

// 在应用初始化时预加载关键视频
window.addEventListener('load', () => {
    const importantVideos = [
        // 添加关键视频URL
    ];

    preloadVideos(importantVideos).then(results => {
        console.log('视频预加载完成:', results);
    });
});

window.addEventListener('resize', setMobileHeight)
window.addEventListener('load', setMobileHeight)
setMobileHeight()

app.use(ElementPlus)
app.use(router)
app.directive('lazy', lazyLoad)

// 修改初始化搜索的逻辑
const initializeSearch = async () => {
    try {
        // 等待路由准备就绪
        await router.isReady();
        // 加载所有页面内容并初始化搜索索引
        const allPageContents = await contentLoader.loadAllPageContents()
        searchService.initializeAllContents(allPageContents)
        console.log('搜索内容初始化完成，共加载', allPageContents.length, '条内容')
    } catch (error) {
        console.error('搜索内容初始化失败:', error)
    }
}

// 在应用挂载后初始化搜索
router.isReady().then(() => {
    // 延迟一段时间确保所有内容加载完成
    setTimeout(() => {
        initializeSearch().catch(error => {
            console.error('初始化搜索时发生未捕获错误:', error)
        })
    }, 1000)
})

app.mount('#app')
