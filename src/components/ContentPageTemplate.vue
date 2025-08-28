<!-- src/components/ContentPageTemplate.vue -->
<template>
  <div class="common-layout">
    <el-container class="page-container">
      <el-container>
        <!-- 侧边栏 (页面导航) - 显示路由页面标题 -->
        <el-aside
            width="260px"
            class="page-nav-aside"
            :class="{ 'mobile-hidden': isMobile }"
        >
          <div
              class="page-nav-wrapper"
              :class="{ 'fixed-page-nav': isPageNavFixed }"
              :style="fixedPageNavStyle"
          >
            <div class="page-nav-header">
              <h2 class="nav-title">页面导航</h2>
              <el-icon class="nav-icon"><Menu /></el-icon>
            </div>
            <el-scrollbar class="page-nav-scrollbar">
              <el-menu
                  :default-active="currentRoutePath"
                  @select="handlePageSelect"
                  class="page-nav-menu"
                  :collapse-transition="false"
              >
                <el-menu-item
                    v-for="page in pageRoutes"
                    :key="page.path"
                    :index="page.path"
                    class="nav-menu-item"
                >
                  <template #title>
                    <span>{{ page.meta.title }}</span>
                  </template>
                </el-menu-item>
              </el-menu>
            </el-scrollbar>
          </div>
        </el-aside>

        <!-- 主内容区域 -->
        <el-main class="content-main">
          <div
              v-if="isMobile"
              class="mobile-buttons"
              :class="{ 'mobile-buttons-fixed': isMobile }"
          >
            <div class="mobile-nav-button" @click="openMobilePageNavigation">
              <el-icon><Menu /></el-icon>
              <span>页面导航</span>
            </div>
            <div class="mobile-toc-button" @click="showMobileToc = true">
              <el-icon><Collection /></el-icon>
              <span>目录</span>
            </div>
          </div>

          <!-- 页面进度条 -->
          <div class="page-progress-bar" :style="{ width: readingProgress + '%' }"></div>
          <div class="page-progress-text">{{ Math.round(readingProgress) }}%</div>

          <div class="content-wrapper">
            <header class="content-header" v-if="currentPageTitle">
              <h1 class="page-title">{{ currentPageTitle }}</h1>
              <div class="title-decoration"></div>
            </header>

            <div class="content-container" v-if="currentFile">
              <header class="content-header-section">
                <div class="header-content">
                  <h2 class="content-title">{{ currentFile.title }}</h2>
                  <div class="file-meta" v-if="currentFile.lastUpdated">
                    <el-tag type="info" size="small" class="meta-tag">
                      最后更新: {{ currentFile.lastUpdated }}
                    </el-tag>
                  </div>
                </div>
              </header>

              <article
                  class="content-body"
                  v-html="processedContent"
                  ref="contentBodyInner"
              ></article>
            </div>

            <div class="empty-content" v-else>
              <div class="empty-illustration">
                <div class="empty-icon-wrapper">
                  <el-icon class="empty-icon"><Document /></el-icon>
                </div>
              </div>
              <h3 class="empty-title">欢迎使用文档中心</h3>
              <p class="empty-description">请选择一个页面开始阅读</p>
              <el-button
                  type="primary"
                  round
                  @click="goToFirstPage"
                  class="start-button"
              >
                开始阅读
              </el-button>
            </div>

            <div class="page-navigation" v-if="currentFile">
              <el-row justify="space-between" align="middle" :gutter="20">
                <el-col :span="11">
                  <el-button
                      v-if="hasPreviousFile"
                      class="nav-button prev-button"
                      @click="navigateToPrevious"
                      round
                  >
                    <el-icon class="nav-icon"><ArrowLeft /></el-icon>
                    <span class="button-text">{{ previousFile.title }}</span>
                  </el-button>
                </el-col>
                <el-col :span="2" class="nav-center">
                  <el-badge
                      :value="`${currentIndex + 1}/${allFiles.length}`"
                      type="primary"
                      class="nav-badge"
                  />
                </el-col>
                <el-col :span="11">
                  <el-button
                      v-if="hasNextFile"
                      class="nav-button next-button"
                      @click="navigateToNext"
                      round
                  >
                    <span class="button-text">{{ nextFile.title }}</span>
                    <el-icon class="nav-icon"><ArrowRight /></el-icon>
                  </el-button>
                </el-col>
              </el-row>
            </div>

            <!-- 页脚 -->
            <div class="page-footer" v-if="currentFile">
              <div class="footer-content">
                <p class="copyright">© 2025 Web3 入门指南. All rights reserved.</p>
              </div>
            </div>
          </div>
        </el-main>

        <!-- 右侧目录栏 (移动端隐藏) - 显示页面内容章节标题 -->
        <el-aside
            width="260px"
            class="toc-aside"
            :class="{ 'mobile-hidden': isMobile }"
            v-show="tocItems.length > 0"
        >
          <div
              class="toc-wrapper"
              :class="{ 'fixed-toc': isTocFixed }"
              :style="fixedTocStyle"
          >
            <div class="toc-header">
              <h2 class="toc-title">目录</h2>
              <el-icon class="toc-icon"><Collection /></el-icon>
            </div>
            <el-scrollbar class="toc-scrollbar">
              <el-tree
                  :data="tocItems"
                  :props="treeProps"
                  node-key="id"
                  ref="treeRef"
                  @node-click="handleTocNodeClick"
                  class="toc-tree"
                  :current-node-key="activeTocId"
                  highlight-current
                  :expand-on-click-node="false"
                  :default-expand-all="true"
              />
            </el-scrollbar>
          </div>
        </el-aside>
      </el-container>

      <!-- 移动端目录抽屉 -->
      <el-drawer
          v-model="showMobileToc"
          title="目录"
          direction="btt"
          size="70%"
          class="mobile-toc-drawer"
      >
        <el-tree
            :data="tocItems"
            :props="treeProps"
            node-key="id"
            ref="mobileTreeRef"
            @node-click="handleMobileTocNodeClick"
            class="mobile-toc-tree"
            :current-node-key="activeTocId"
            highlight-current
            :expand-on-click-node="false"
            :default-expand-all="true"
        />
      </el-drawer>

      <!-- 移动端页面导航抽屉 -->
      <el-drawer
          v-model="showMobilePageNav"
          title="页面导航"
          direction="btt"
          size="70%"
          class="mobile-page-nav-drawer"
      >
        <el-menu
            :default-active="currentRoutePath"
            @select="handlePageSelect"
            class="mobile-page-nav-menu"
        >
          <el-menu-item
              v-for="page in pageRoutes"
              :key="page.path"
              :index="page.path"
              class="mobile-nav-item"
          >
            {{ page.meta.title }}
          </el-menu-item>
        </el-menu>
      </el-drawer>

      <!-- 返回顶部按钮 -->
      <transition name="back-top-fade">
        <div
            v-show="showBackTop"
            class="back-top-button"
            @click="scrollToTop"
        >
          <img src="/public/logo.svg" alt="imKey">
        </div>
      </transition>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch, nextTick } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  Collection,
  Document,
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  contentData: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const route = useRoute()

const treeRef = ref(null)
const mobileTreeRef = ref(null)
const contentBodyInner = ref(null)
const isMobile = ref(false)
const showMobileToc = ref(false)
const showMobilePageNav = ref(false)
const isPageNavFixed = ref(false)
const isTocFixed = ref(false)
const pageNavTop = ref(0)
const tocTop = ref(0)
const pageNavWidth = ref(0)
const tocWidth = ref(0)
const pageNavOffset = ref(0)
const tocOffset = ref(0)
const activeTocId = ref('')
const scrollTimeout = ref(null)
const readingProgress = ref(0)
const navbarHeight = ref(60)
const showBackTop = ref(false)
const currentFile = ref(null)

const pageRoutes = computed(() => {
  return router.options.routes.filter(r => r.meta && r.meta.title)
})

const currentRoutePath = computed(() => {
  return route.path
})

const currentPageTitle = computed(() => {
  const currentRoute = pageRoutes.value.find(r => r.path === currentRoutePath.value)
  return currentRoute ? currentRoute.meta.title : ''
})

const processedContent = computed(() => {
  if (!currentFile.value || !currentFile.value.content) return ''

  let content = currentFile.value.content

  // 为图片添加懒加载属性，但避免重复添加
  content = content.replace(/<img([^>]*?)src=(['"])([^'"]*?)\2([^>]*?)>/g, (match, beforeSrc, quote, src, afterSrc) => {
    // 检查是否已经包含loading属性
    if (match.includes('loading=')) {
      return match
    }
    return `<img${beforeSrc}src=${quote}${src}${quote} loading="lazy"${afterSrc}>`
  })

  // 为iframe添加懒加载属性，但避免重复添加
  content = content.replace(/<iframe([^>]*?)src=(['"])([^'"]*?)\2([^>]*?)>/g, (match, beforeSrc, quote, src, afterSrc) => {
    // 检查是否已经包含loading属性
    if (match.includes('loading=')) {
      return match
    }
    return `<iframe${beforeSrc}src=${quote}${src}${quote} loading="lazy"${afterSrc}>`
  })

  return content
})

// 目录项 - 从页面内容中提取标题
const tocItems = computed(() => {
  // 使用通过 props 传递的内容数据
  const pageContents = props.contentData.sections || []

  if (!pageContents || !Array.isArray(pageContents)) return []

  const toc = []

  pageContents.forEach(section => {
    const sectionItem = {
      id: section.id,
      label: section.title,
      level: 1,
      children: []
    }

    if (section.children && Array.isArray(section.children)) {
      section.children.forEach(file => {
        sectionItem.children.push({
          id: file.id,
          label: file.title,
          level: 2
        })
      })
    }

    toc.push(sectionItem)
  })

  return toc
})

const treeProps = {
  label: 'label',
  children: 'children'
}

// 计算上一篇和下一篇文件
const allFiles = computed(() => {
  // 使用通过 props 传递的内容数据
  const pageContents = props.contentData.sections || []

  const files = []

  const collectFiles = (items) => {
    items.forEach(item => {
      if (item.children) {
        collectFiles(item.children)
      } else if (item.content) {
        files.push(item)
      }
    })
  }

  collectFiles(pageContents)
  return files
})

const currentIndex = computed(() => {
  if (!currentFile.value) return -1
  return allFiles.value.findIndex(file => file.id === currentFile.value.id)
})

const hasPreviousFile = computed(() => {
  return currentIndex.value > 0
})

const hasNextFile = computed(() => {
  return currentIndex.value < allFiles.value.length - 1
})

const previousFile = computed(() => {
  if (!hasPreviousFile.value) return null
  return allFiles.value[currentIndex.value - 1]
})

const nextFile = computed(() => {
  if (!hasNextFile.value) return null
  return allFiles.value[currentIndex.value + 1]
})

// 固定侧边栏的样式
const fixedPageNavStyle = computed(() => {
  if (isPageNavFixed.value) {
    return {
      width: pageNavWidth.value + 'px',
      top: pageNavOffset.value + 'px'
    }
  }
  return {}
})

const fixedTocStyle = computed(() => {
  if (isTocFixed.value) {
    return {
      width: tocWidth.value + 'px',
      top: tocOffset.value + 'px'
    }
  }
  return {}
})

// 检查是否为移动设备
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 处理页面选择
const handlePageSelect = (path) => {
  router.push(path)
  showMobilePageNav.value = false
}

// 处理目录节点点击
const handleTocNodeClick = (data) => {
  // 查找对应的文件
  const file = allFiles.value.find(f => f.id === data.id)
  if (file) {
    currentFile.value = file
    // 滚动到顶部
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  } else {
    // 如果是章节标题，则滚动到该章节
    const element = document.getElementById(data.id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const handleMobileTocNodeClick = (data) => {
  showMobileToc.value = false
  // 查找对应的文件
  const file = allFiles.value.find(f => f.id === data.id)
  if (file) {
    currentFile.value = file
    // 滚动到顶部
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  } else {
    // 如果是章节标题，则滚动到该章节
    const element = document.getElementById(data.id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// 打开移动端页面导航
const openMobilePageNavigation = () => {
  showMobilePageNav.value = true
}

// 计算阅读进度
const calculateReadingProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const progress = (scrollTop / scrollHeight) * 100

  readingProgress.value = isNaN(progress) ? 0 : progress
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 更新锚点位置信息
const updateAnchorPosition = () => {
  if (isMobile.value) return

  const pageNavWrapper = document.querySelector('.page-nav-wrapper')
  const tocWrapper = document.querySelector('.toc-wrapper')

  if (pageNavWrapper) {
    const rect = pageNavWrapper.getBoundingClientRect()
    pageNavTop.value = rect.top + window.scrollY
    pageNavWidth.value = rect.width
    pageNavOffset.value = navbarHeight.value
  }

  if (tocWrapper) {
    const rect = tocWrapper.getBoundingClientRect()
    tocTop.value = rect.top + window.scrollY
    tocWidth.value = rect.width
    tocOffset.value = navbarHeight.value
  }
}

// 处理滚动事件，控制侧边栏固定和返回顶部按钮显示
const handleScroll = () => {
  const pageNavWrapper = document.querySelector('.page-nav-wrapper')
  const tocWrapper = document.querySelector('.toc-wrapper')
  const footer = document.querySelector('.page-footer')

  if (pageNavWrapper && !isMobile.value) {
    // 当页面滚动超过侧边栏原始位置时，固定侧边栏
    isPageNavFixed.value = window.scrollY >= pageNavTop.value - navbarHeight.value

    // 检查是否滚动到页脚附近，调整侧边栏高度
    if (footer) {
      const footerTop = footer.getBoundingClientRect().top
      const windowHeight = window.innerHeight
      if (footerTop < windowHeight) {
        // 当接近页脚时，调整侧边栏高度
        const pageNavWrapper = document.querySelector('.page-nav-wrapper')
        if (pageNavWrapper) {
          pageNavWrapper.style.height = `calc(100vh - ${navbarHeight.value}px - ${windowHeight - footerTop}px)`
        }
      } else {
        // 恢复正常高度
        const pageNavWrapper = document.querySelector('.page-nav-wrapper')
        if (pageNavWrapper) {
          pageNavWrapper.style.height = ''
        }
      }
    }
  }

  if (tocWrapper && !isMobile.value) {
    // 当页面滚动超过目录原始位置时，固定目录
    isTocFixed.value = window.scrollY >= tocTop.value - navbarHeight.value

    // 检查是否滚动到页脚附近，调整目录高度
    if (footer) {
      const footerTop = footer.getBoundingClientRect().top
      const windowHeight = window.innerHeight
      if (footerTop < windowHeight) {
        // 当接近页脚时，调整目录高度
        const tocWrapper = document.querySelector('.toc-wrapper')
        if (tocWrapper) {
          tocWrapper.style.height = `calc(100vh - ${navbarHeight.value}px - ${windowHeight - footerTop}px)`
        }
      } else {
        // 恢复正常高度
        const tocWrapper = document.querySelector('.toc-wrapper')
        if (tocWrapper) {
          tocWrapper.style.height = ''
        }
      }
    }
  }

  // 计算阅读进度
  calculateReadingProgress()

  // 控制返回顶部按钮显示
  showBackTop.value = window.scrollY > 300
}

// 检测当前可视区域的章节
const detectCurrentSection = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.clientHeight

  // 收集所有章节元素
  const sections = tocItems.value.map(item => item.id)

  // 查找当前可视区域的章节
  for (let i = sections.length - 1; i >= 0; i--) {
    const sectionId = sections[i]
    const element = document.getElementById(sectionId)

    if (element) {
      const offsetTop = element.offsetTop
      // 如果元素顶部在可视区域内，则认为是当前章节
      if (offsetTop <= scrollTop + scrollHeight * 0.3) {
        activeTocId.value = sectionId
        // 更新树节点的选中状态
        nextTick(() => {
          const { value: value1 } = treeRef
          if (value1) {
            value1.setCurrentKey(sectionId)
          }
          const { value: value2 } = mobileTreeRef
          if (value2) {
            value2.setCurrentKey(sectionId)
          }
        })
        break
      }
    }
  }
}

// 导航到上一篇/下一篇
const navigateToPrevious = () => {
  if (hasPreviousFile.value && previousFile.value) {
    currentFile.value = previousFile.value
  }
}

const navigateToNext = () => {
  if (hasNextFile.value && nextFile.value) {
    currentFile.value = nextFile.value
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkIsMobile()

  // 当屏幕尺寸变化时，重新计算锚点位置
  nextTick(() => {
    updateAnchorPosition()
  })
}

// 组件挂载时初始化
onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll)

  // 初始化第一个文件
  if (allFiles.value.length > 0) {
    currentFile.value = allFiles.value[0]
  }

  // 等待DOM渲染完成后获取位置信息
  setTimeout(() => {
    updateAnchorPosition()
    detectCurrentSection()
    // 初始化进度计算
    calculateReadingProgress()
  }, 100)

  // 监听搜索结果选择事件
  window.addEventListener('search-result-selected', handleSearchResultSelected)
})

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('search-result-selected', handleSearchResultSelected)
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})

// 监听路由变化
watch(() => route.path, () => {
  // 当路由变化时，重置当前文件
  if (allFiles.value.length > 0) {
    currentFile.value = allFiles.value[0]
  }
})

// 监听当前文件变化，自动滚动到顶部
watch(currentFile, (newFile, oldFile) => {
  if (newFile && newFile.id !== oldFile?.id) {
    // 在DOM更新后执行滚动操作
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' },
      readingProgress.value = 0,

      // 更新TOC激活项
      detectCurrentSection())
    })
  }
})

// 防抖处理章节检测
const debouncedDetectSection = () => {
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }

  scrollTimeout.value = setTimeout(() => {
    detectCurrentSection()
  }, 100)
}

// 添加滚动事件监听器
onMounted(() => {
  window.addEventListener('scroll', debouncedDetectSection)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', debouncedDetectSection)
})

// 跳转到第一个页面
const goToFirstPage = () => {
  if (pageRoutes.value.length > 0) {
    router.push(pageRoutes.value[0].path)
  }
}

// 处理搜索结果选择事件
const handleSearchResultSelected = (event) => {
  const { fileId } = event.detail
  if (fileId) {
    // 查找对应的文件
    const file = allFiles.value.find(f => f.id === fileId)
    if (file) {
      currentFile.value = file
      // 滚动到顶部
      nextTick(() => {
        window.scrollTo({ top: 0 })
      })
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%);
  padding: 0;
  margin-top: var(--navbar-height);
  position: relative;
}

/* 页面进度条 */
.page-progress-bar {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  z-index: 1001;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(186, 149, 92, 0.7);
}

.page-progress-text {
  position: fixed;
  top: calc(var(--navbar-height) + 8px);
  right: 25px;
  z-index: 1002;
  background: var(--secondary-color);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: bold;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  transform: translateY(-50%);
}

/* 移动端按钮 */
.mobile-buttons {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: var(--navbar-height);
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
}

.mobile-buttons-fixed {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  right: 0;
  padding: 15px;
  margin: 0;
  z-index: 100;
}

.mobile-nav-button,
.mobile-toc-button {
  flex: 1;
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-weight: 600;
  color: var(--secondary-color);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.mobile-nav-button:hover,
.mobile-toc-button:hover {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-color: var(--accent-color);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(186, 149, 92, 0.2);
}

/* 内容包装器 */
.content-wrapper {
  padding: 30px;
  box-sizing: border-box;
  padding-top: calc(var(--navbar-height) + 30px);
}

/* 页面标题 */
.content-header {
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 2px solid var(--border-color);
  position: relative;
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  color: var(--secondary-color);
  margin: 0;
  text-align: center;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.title-decoration {
  width: 100px;
  height: 5px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 3px;
  margin: 20px auto 0;
  box-shadow: 0 3px 10px rgba(186, 149, 92, 0.4);
}

/* 内容容器 */
.content-container {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  position: relative;
  overflow: hidden;
}

.content-container:hover {
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.15);
  transform: translateY(-8px);
}

.content-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 20px 20px 0 0;
}

.content-header-section {
  margin-bottom: 35px;
  padding-bottom: 25px;
  border-bottom: 2px dashed var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.content-title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--secondary-color);
  margin: 0;
  flex: 1;
}

.file-meta {
  display: flex;
  justify-content: flex-end;
}

.meta-tag {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(186, 149, 92, 0.2);
}

/* 内容样式 */
.content-body {
  line-height: 1.9;
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.content-body h2 {
  font-size: var(--font-size-2xl);
  color: var(--secondary-color);
  margin: 40px 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 3px solid var(--accent-color);
  position: relative;
  font-weight: 700;
}

.content-body h2::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color), transparent);
  border-radius: 2px;
}

.content-body h3 {
  font-size: var(--font-size-xl);
  color: var(--secondary-color);
  margin: 30px 0 20px 0;
  position: relative;
  padding-left: 20px;
  font-weight: 700;
}

.content-body h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  width: 6px;
  height: 24px;
  background: var(--accent-color);
  border-radius: 3px;
}

.content-body p {
  font-size: var(--font-size-base);
  margin: 20px 0;
  color: var(--text-primary);
  line-height: 1.9;
}

.content-body ul,
.content-body ol {
  padding-left: 35px;
  margin: 25px 0;
}

.content-body li {
  margin: 15px 0;
  line-height: 1.9;
}

.content-body strong {
  color: var(--secondary-color);
  font-weight: 700;
}

.content-body a {
  color: var(--accent-color);
  text-decoration: none;
  border-bottom: 1px dotted var(--accent-color);
  transition: all 0.3s ease;
  font-weight: 500;
}

.content-body a:hover {
  color: var(--secondary-color);
  border-bottom: 1px solid var(--secondary-color);
  background-color: rgba(186, 149, 92, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}

.content-body img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 25px 0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  display: block;
  margin-left: auto;
  margin-right: auto;
  /* 懒加载样式 */
  opacity: 0;
  transition: opacity 0.3s ease;
}

.content-body img[lazy="loaded"] {
  opacity: 1;
}

.content-body img:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.content-body code {
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-sm);
  color: #d63384;
}

.content-body pre {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 25px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 25px 0;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 视频容器样式 */
.content-body .video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 宽高比 */
  margin: 25px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.content-body .video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  /* 懒加载样式 */
  opacity: 0;
  transition: opacity 0.3s ease;
}

.content-body .video-container iframe[lazy="loaded"] {
  opacity: 1;
}

/* 空内容样式 */
.empty-content {
  text-align: center;
  padding: 80px 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.empty-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 20px 20px 0 0;
}

.empty-illustration {
  margin-bottom: 40px;
}

.empty-icon-wrapper {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-radius: 50%;
  border: 3px solid var(--accent-color);
  box-shadow: 0 8px 25px rgba(186, 149, 92, 0.3);
}

.empty-icon {
  font-size: 56px;
  color: var(--accent-color);
}

.empty-title {
  font-size: var(--font-size-2xl);
  color: var(--secondary-color);
  margin: 25px 0 15px 0;
  font-weight: 800;
}

.empty-description {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0 0 40px;
}

.start-button {
  background: linear-gradient(135deg, var(--accent-color) 0%, #d4b68c 100%);
  border: none;
  padding: 15px 35px;
  font-size: var(--font-size-base);
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  box-shadow: 0 6px 20px rgba(186, 149, 92, 0.4);
  border-radius: 30px;
}

.start-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(186, 149, 92, 0.5);
}

/* 页面导航 */
.page-navigation {
  margin: 50px 0;
  padding: 0 30px;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 25px;
  background: linear-gradient(135deg, #2A3535 0%, #1a2222 100%);
  border: 2px solid #1a2222;
  border-radius: 35px;
  font-weight: 600;
  color: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  min-height: 60px;
}

.nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.3), rgba(42, 53, 53, 0.3));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.nav-button:hover::before {
  opacity: 1;
}

.nav-button:hover {
  background: linear-gradient(135deg, #1a2222 0%, #0d1414 100%);
  border-color: #0d1414;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.prev-button .nav-icon {
  margin-right: 12px;
}

.next-button .nav-icon {
  margin-left: 12px;
}

.button-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.nav-center {
  text-align: center;
}

.nav-badge :deep(.el-badge__content) {
  background: linear-gradient(135deg, var(--accent-color) 0%, #d4b68c 100%);
  border: none;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 15px;
  box-shadow: 0 3px 8px rgba(186, 149, 92, 0.4);
}

/* 页脚 */
.page-footer {
  text-align: center;
  padding: 40px 0;
  margin-top: 40px;
  border-top: 2px solid var(--border-color);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.copyright {
  margin: 0;
  font-weight: 500;
}

/* 侧边栏导航 */
.page-nav-aside,
.toc-aside {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-right: 2px solid var(--border-color);
  box-shadow: 3px 0 15px rgba(0, 0, 0, 0.08);
  height: calc(100vh - var(--navbar-height));
  position: fixed;
  top: var(--navbar-height);
  bottom: 0;
  z-index: 10;
  overflow-y: auto;
}

.toc-aside {
  border-right: none;
  border-left: 2px solid var(--border-color);
  box-shadow: -3px 0 15px rgba(0, 0, 0, 0.08);
  right: 0;
}

.page-nav-wrapper,
.toc-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-nav-header,
.toc-header {
  padding: 25px;
  border-bottom: 2px solid var(--border-color);
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-title,
.toc-title {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--secondary-color);
  font-weight: 800;
}

.nav-icon,
.toc-icon {
  font-size: 24px;
  color: var(--accent-color);
}

.page-nav-scrollbar,
.toc-scrollbar {
  flex: 1;
}

.page-nav-menu {
  border: none;
  background-color: transparent;
}

.nav-menu-item {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  height: 55px;
  line-height: 55px;
  border-left: 4px solid transparent;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  border-radius: 0 10px 10px 0;
  margin: 8px 15px;
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.nav-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.15), rgba(42, 53, 53, 0.15));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.nav-menu-item:hover::before {
  opacity: 1;
}

.nav-menu-item:hover {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  color: var(--accent-color);
  border-left-color: var(--accent-color);
  transform: translateX(5px);
}

.nav-menu-item.is-active {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  color: var(--accent-color);
  font-weight: 700;
  border-left-color: var(--accent-color);
}

/* 目录树样式 */
.toc-tree,
.mobile-toc-tree {
  background-color: transparent;
  border: none;
}

.toc-tree :deep(.el-tree-node__content),
.mobile-toc-tree :deep(.el-tree-node__content) {
  height: 50px;
  border-radius: 10px;
  margin: 8px 15px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.toc-tree :deep(.el-tree-node__content)::before,
.mobile-toc-tree :deep(.el-tree-node__content)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.15), rgba(42, 53, 53, 0.15));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.toc-tree :deep(.el-tree-node__content:hover)::before,
.mobile-toc-tree :deep(.el-tree-node__content:hover)::before {
  opacity: 1;
}

.toc-tree :deep(.el-tree-node__content:hover),
.mobile-toc-tree :deep(.el-tree-node__content:hover) {
  background-color: #fff9f0;
  color: var(--accent-color);
  transform: translateX(5px);
}

.toc-tree :deep(.el-tree-node.is-current > .el-tree-node__content),
.mobile-toc-tree :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  color: var(--accent-color);
  font-weight: 700;
}

/* 移动端抽屉 */
.mobile-toc-drawer :deep(.el-drawer__header),
.mobile-page-nav-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 25px;
  border-bottom: 2px solid var(--border-color);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.mobile-page-nav-menu {
  border: none;
  background-color: transparent;
  padding: 15px 0;
}

.mobile-nav-item {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  height: 55px;
  line-height: 55px;
  border-left: 4px solid transparent;
  margin: 8px 20px;
  border-radius: 10px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.mobile-nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.15), rgba(42, 53, 53, 0.15));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.mobile-nav-item:hover::before {
  opacity: 1;
}

.mobile-nav-item:hover {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  color: var(--accent-color);
  border-left-color: var(--accent-color);
  transform: translateX(5px);
}

.mobile-nav-item.is-active {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  color: var(--accent-color);
  font-weight: 700;
  border-left-color: var(--accent-color);
}

/* 主内容区域添加左右边距，避免被固定侧边栏遮挡 */
.content-main {
  margin-left: 260px;
  margin-right: 260px;
}

/* 返回顶部按钮 */
.back-top-button {
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--accent-color) 0%, #d4b68c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  border: 3px solid #ffffff;
}

.back-top-button:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.back-top-icon {
  font-size: 28px;
  color: white;
  font-weight: bold;
}

/* 移动端适配 */
@media (max-width: 1200px) {
  .page-nav-aside,
  .toc-aside {
    width: 220px;
  }

  .content-main {
    margin-left: 220px;
    margin-right: 220px;
  }
}

@media (max-width: 992px) {
  .page-nav-aside,
  .toc-aside {
    width: 200px;
  }

  .content-main {
    margin-left: 200px;
    margin-right: 200px;
  }

  .content-container {
    padding: 30px;
    border-radius: 16px;
  }

  .page-title {
    font-size: var(--font-size-3xl);
  }

  .content-title {
    font-size: var(--font-size-2xl);
  }

  .back-top-button {
    bottom: 25px;
    right: 25px;
    width: 50px;
    height: 50px;
  }

  .back-top-icon {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .page-nav-aside,
  .toc-aside {
    display: none;
  }

  .mobile-hidden {
    display: none;
  }

  .content-main {
    margin-left: 0;
    margin-right: 0;
  }

  .content-wrapper {
    padding: 20px;
    padding-top: calc(var(--navbar-height) + 100px);
  }

  .content-container {
    padding: 25px;
    border-radius: 14px;
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }

  .content-title {
    font-size: var(--font-size-xl);
  }

  .page-navigation {
    padding: 0 15px;
  }

  .nav-button {
    padding: 15px 20px;
    border-radius: 30px;
    min-height: 50px;
  }

  .button-text {
    max-width: 160px;
    font-size: var(--font-size-sm);
  }

  .page-container {
    margin-top: 0;
  }

  .mobile-buttons {
    position: fixed;
    top: var(--navbar-height);
    left: 0;
    right: 0;
    padding: 15px;
    margin: 0;
    z-index: 100;
    border-radius: 0;
    box-sizing: border-box;
  }

  .page-progress-text {
    top: calc(var(--navbar-height) + 10px);
    right: 15px;
    padding: 3px 8px;
    font-size: 12px;
  }

  .back-top-button {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }

  .back-top-icon {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .mobile-buttons {
    padding: 12px;
    gap: 12px;
  }

  .mobile-nav-button,
  .mobile-toc-button {
    padding: 12px;
    font-size: var(--font-size-sm);
    border-radius: 10px;
  }

  .content-wrapper {
    padding: 15px;
    padding-top: calc(var(--navbar-height) + 100px);
  }

  .content-container {
    padding: 20px;
    border-radius: 12px;
  }

  .page-title {
    font-size: var(--font-size-xl);
  }

  .content-title {
    font-size: var(--font-size-lg);
  }

  .content-body h2 {
    font-size: var(--font-size-xl);
  }

  .content-body h3 {
    font-size: var(--font-size-lg);
  }

  .content-body p {
    font-size: var(--font-size-sm);
  }

  .button-text {
    max-width: 130px;
  }

  .page-progress-text {
    top: calc(var(--navbar-height) + 5px);
    right: 10px;
    padding: 2px 6px;
    font-size: 11px;
  }

  .back-top-button {
    bottom: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
  }

  .back-top-icon {
    font-size: 18px;
  }

  /* 优化小屏幕上的导航按钮布局 */
  .page-navigation {
    margin: 40px 0 20px;
    padding: 0 10px;
  }

  .nav-button {
    padding: 12px 15px;
    border-radius: 25px;
    min-height: 45px;
  }

  .prev-button .nav-icon,
  .next-button .nav-icon {
    margin: 0;
  }

  .button-text {
    max-width: 100px;
    font-size: 12px;
  }

  .nav-badge :deep(.el-badge__content) {
    padding: 3px 6px;
    font-size: 12px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .nav-button {
    padding: 10px 12px;
    border-radius: 20px;
    min-height: 40px;
  }

  .button-text {
    max-width: 80px;
    font-size: 11px;
  }

  .prev-button .nav-icon,
  .next-button .nav-icon {
    font-size: 14px;
  }

  .nav-badge :deep(.el-badge__content) {
    padding: 3px 6px;
    font-size: 11px;
  }
}

/* 动画效果 */
.back-top-fade-enter-active,
.back-top-fade-leave-active {
  transition: opacity 0.4s ease;
}

.back-top-fade-enter-from,
.back-top-fade-leave-to {
  opacity: 0;
}

/* 优化移动端页面导航按钮布局 */
@media (max-width: 768px) {
  .page-navigation {
    margin: 40px 0 20px;
  }

  .nav-button {
    padding: 12px 15px;
    min-height: auto;
    font-size: var(--font-size-sm);
  }

  .button-text {
    max-width: none;
    white-space: normal;
    line-height: 1.4;
    text-align: center;
  }

  .nav-icon {
    display: none;
  }

  .nav-badge :deep(.el-badge__content) {
    padding: 3px 6px;
    font-size: 11px;
  }

  .nav-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .page-navigation {
    margin: 30px 0 15px;
  }

  .nav-button {
    padding: 10px 12px;
    font-size: var(--font-size-xs);
  }

  .button-text {
    font-size: var(--font-size-xs);
  }
}
</style>
