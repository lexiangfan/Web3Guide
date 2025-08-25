<!-- src/App.vue -->
<script setup>
import {ref, onMounted, computed, onUnmounted, watch} from 'vue'
import router from '@/router/router'
import GlobalSearch from '@/components/GlobalSearch.vue'
import searchService from "@/services/searchService.js"
import contentLoader from "@/services/contentLoader.js"
import '@/assets/global.css'
import imKey from "@/public/images/imKey.svg"

const activeIndex = ref('1')
const isMobileMenuCollapsed = ref(true)
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => {
  return windowWidth.value <= 768
})

const contentAreaClasses = computed(() => {
  return {
    'content-area': true,
    'content-with-navbar': true,
    'with-mobile-menu': !isMobileMenuCollapsed.value && windowWidth.value <= 768
  }
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value > 768) {
    isMobileMenuCollapsed.value = true
  }
}

// 优化路由处理逻辑
const handleSelect = (key) => {
  // 根据菜单项索引确定目标路由
  const routeMap = {
    '1': '/',
    '2': '/page1',
    '3': '/page'
  }

  const targetRoute = routeMap[key] || '/'

  // 只有当目标路由与当前路由不同时才进行跳转
  if (router.currentRoute.value.path !== targetRoute) {
    router.push(targetRoute).catch(err => {
      console.log('路由跳转被阻止或失败:', err)
    })
  }

  // 更新活动索引
  activeIndex.value = key

  // 移动端收起菜单
  if (windowWidth.value <= 768) {
    isMobileMenuCollapsed.value = true
  }
}

// 监听路由变化，同步更新导航栏活动状态
watch(() => router.currentRoute.value, (to) => {
  switch (to.path) {
    case '/':
      activeIndex.value = '1'
      break
    case '/page1':
      activeIndex.value = '2'
      break
    case '/page':
      activeIndex.value = '3'
      break
    default:
      activeIndex.value = '1'
  }
}, { immediate: true })

const goToImKey = () => {
  window.open('https://imkey.im', '_blank')
}

// 初始化内容
const initializeContent = async () => {
  try {
    // 重置搜索索引以避免重复
    searchService.resetIndex();
    // 加载所有页面内容并初始化搜索索引
    const allPageContents = await contentLoader.loadAllPageContents();
    searchService.initializeAllContents(allPageContents);
    console.log('Successfully initialized all content for search');
  } catch (error) {
    console.error('Failed to initialize content:', error);
  }
}

const toggleMobileMenu = () => {
  isMobileMenuCollapsed.value = !isMobileMenuCollapsed.value
}

// 移动端菜单的键盘支持
const handleMobileMenuKeydown = (event) => {
  if (event.key === 'Escape' && !isMobileMenuCollapsed.value) {
    isMobileMenuCollapsed.value = true
  }
}

onMounted(() => {
  // 延迟初始化以确保路由已准备就绪
  setTimeout(() => {
    initializeContent()
  }, 100)

  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleMobileMenuKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleMobileMenuKeydown)
})
</script>

<template>
  <div id="app">
    <div class="navbar navbar-fixed">
      <div class="navbar-container">
        <div class="navbar-left">
          <div class="logo-item" @click="() => router.push('/')">
            <div class="logo-wrapper">
              <img :src="imKey" alt="imKey" class="navbar-logo">
            </div>
          </div>
        </div>

        <div
            class="navbar-center"
            :class="{ 'hidden-mobile': isMobileMenuCollapsed }"
            role="navigation"
            aria-label="主导航"
        >
          <el-menu
              :default-active="activeIndex"
              mode="horizontal"
              :ellipsis="false"
              @select="handleSelect"
          >
            <el-menu-item index="1">一步步开始</el-menu-item>
            <el-menu-item index="2">新手帮助</el-menu-item>
            <el-menu-item index="3">发现更多</el-menu-item>
          </el-menu>
        </div>

        <div class="navbar-right">
          <GlobalSearch class="navbar-search"/>
          <el-button
              type="primary"
              link
              class="github-button"
              @click="goToImKey"
          >
            直达 imKey 官网
          </el-button>

          <div
              v-if="isMobile"
              class="mobile-menu-toggle"
              @click="toggleMobileMenu"
              @keydown.enter="toggleMobileMenu"
              @keydown.space="toggleMobileMenu"
              role="button"
              tabindex="0"
              aria-expanded="!isMobileMenuCollapsed"
              aria-label="切换移动端菜单"
          >
            <svg class="menu-icon" viewBox="0 0 1024 1024" width="24" height="24">
              <path v-if="isMobileMenuCollapsed" d="M128 256h768a32 32 0 1 1 0 64H128a32 32 0 0 1 0-64z m0 256h512a32 32 0 1 1 0 64H128a32 32 0 1 1 0-64z m0 256h512a32 32 0 1 1 0 64H128a32 32 0 1 1 0-64z" fill="currentColor"/>
              <path v-else d="M557.312 512l268.288-268.288a32 32 0 0 0-45.248-45.248L512 466.752 243.68 198.432a32 32 0 0 0-45.248 45.248L466.752 512 198.464 780.32a32 32 0 0 0 45.248 45.248L512 557.248l268.288 268.32a32 32 0 0 0 45.248-45.248L557.312 512z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <RouterView :class="contentAreaClasses"/>
  </div>
</template>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  padding: 0;
  height: var(--navbar-height);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 1000;
}

.navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  z-index: 1001;
}

.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  height: 100%;
  position: relative;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  border-radius: 0 0 8px 8px;
  padding: 0 10px;
}

.logo-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  transition: width 0.3s ease;
  border-radius: 2px 2px 0 0;
}

.logo-item:hover::after {
  width: 100%;
}

.logo-item:hover {
  background: linear-gradient(180deg, rgba(186, 149, 92, 0.1), transparent);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}

.navbar-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
  border-radius: 6px;
}

.logo-item:hover .navbar-logo {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.navbar-center {
  display: flex;
  flex: 1;
  justify-content: center;
}

.navbar-center .el-menu {
  background-color: transparent;
  border: none;
  height: 100%;
  position: relative;
}

.navbar-center .el-menu-item {
  color: var(--text-secondary);
  font-weight: 500;
  height: var(--navbar-height);
  line-height: var(--navbar-height);
  font-size: var(--font-size-base);
  padding: 0 25px;
  position: relative;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  margin: 0 5px;
  border-radius: 8px 8px 0 0;
  letter-spacing: 0.5px;
}

.navbar-center .el-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.1), rgba(42, 53, 53, 0.1));
  border-radius: 8px 8px 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.navbar-center .el-menu-item:hover::before {
  opacity: 1;
}

.navbar-center .el-menu-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 3px 3px 0 0;
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.navbar-center .el-menu-item:hover {
  color: var(--secondary-color) !important;
  background-color: rgba(42, 53, 53, 0.03) !important;
}

.navbar-center .el-menu-item:hover::after {
  width: 70%;
}

.navbar-center .el-menu-item.is-active {
  color: var(--secondary-color) !important;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.05), rgba(42, 53, 53, 0.05)) !important;
  text-shadow: 0 0 1px rgba(42, 53, 53, 0.2);
}

.navbar-center .el-menu-item.is-active::after {
  width: 100%;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.github-button {
  color: var(--secondary-color) !important;
  font-weight: 600;
  padding: 0 20px !important;
  height: 42px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  border-radius: 30px;
  border: 2px solid var(--border-color) !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.github-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: 0.5s;
}

.github-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color) !important;
}

.github-button:hover::before {
  left: 100%;
}

.mobile-menu-toggle {
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.mobile-menu-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.1), rgba(42, 53, 53, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.mobile-menu-toggle:hover::before {
  opacity: 1;
}

.mobile-menu-toggle:hover {
  background-color: rgba(42, 53, 53, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-icon {
  color: var(--text-primary);
  transition: transform 0.3s ease;
}

/* 移动端适配 - 下拉菜单样式 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 20px;
  }

  .navbar-center {
    position: fixed;
    top: var(--navbar-height);
    left: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    border-radius: 16px;
    padding: 15px 0;
    transform: translateY(-10px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--border-color);
    max-height: calc(100vh - var(--navbar-height) - 40px);
    overflow-y: auto;
  }

  .navbar-center:not(.hidden-mobile) {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .navbar-center .el-menu {
    flex-direction: column;
    width: 100%;
    padding: 0;
  }

  .navbar-center .el-menu-item {
    height: 55px;
    line-height: 55px;
    text-align: center;
    padding: 0 25px;
    font-size: var(--font-size-base);
    border-bottom: 1px solid var(--border-color);
    transition: all 0.3s ease;
    position: relative;
    margin: 0 15px;
    border-radius: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .navbar-center .el-menu-item:last-child {
    border-bottom: none;
  }

  .navbar-center .el-menu-item:hover {
    background-color: rgba(42, 53, 53, 0.05);
    color: var(--secondary-color) !important;
    transform: translateX(5px);
  }

  .navbar-center .el-menu-item.is-active {
    background: linear-gradient(90deg, rgba(186, 149, 92, 0.1), rgba(42, 53, 53, 0.1));
    color: var(--secondary-color) !important;
    font-weight: 600;
  }

  .navbar-center .el-menu-item::after {
    display: none;
  }

  .navbar-center .el-menu-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: linear-gradient(180deg, var(--accent-color), var(--secondary-color));
    border-radius: 0 4px 4px 0;
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  .navbar-center .el-menu-item.is-active::before {
    transform: scaleY(1);
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .github-button {
    font-size: var(--font-size-xs);
    height: 38px !important;
    padding: 0 15px !important;
  }

  .logo-item {
    padding: 0 8px;
  }

  .navbar-logo {
    height: 28px;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .navbar-container {
    padding: 0 15px;
  }

  .navbar-logo {
    height: 28px;
  }

  .navbar-center {
    left: 15px;
    right: 15px;
  }

  .navbar-center .el-menu-item {
    font-size: var(--font-size-sm);
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
  }

  .github-button {
    display: none;
  }

  .logo-item {
    padding: 0 6px;
  }

  .navbar-logo {
    height: 24px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .navbar-container {
    padding: 0 10px;
  }

  .navbar-logo {
    height: 24px;
  }

  .mobile-menu-toggle {
    width: 36px;
    height: 36px;
  }
}

/* 添加动画效果 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.navbar-center .el-menu-item {
  animation: fadeInDown 0.3s ease forwards;
}

.navbar-center .el-menu-item:nth-child(1) {
  animation-delay: 0.1s;
}

.navbar-center .el-menu-item:nth-child(2) {
  animation-delay: 0.2s;
}

.navbar-center .el-menu-item:nth-child(3) {
  animation-delay: 0.3s;
}

/* 添加脉冲效果到激活状态 */
.navbar-center .el-menu-item.is-active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(186, 149, 92, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(186, 149, 92, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(186, 149, 92, 0);
  }
}

/* 添加悬停时的图标动画 */
.menu-icon:hover {
  transform: rotate(90deg);
}
</style>
