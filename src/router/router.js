// src/router/router.js
import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: '一步步开始'
        }
    },
    {
        path: '/page1',
        name: 'page1',
        component: () => import('@/views/page1.vue'),
        meta: {
            title: '基础知识'
        }
    },
    {
        path: '/page',
        name: 'page',
        component: () => import('@/views/pageTemplate.vue'),
        meta: {
            title: 'Web3 测试'
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 添加路由守卫以更新页面标题
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'imKey 新手指南'
    next()
})

export default router
