<!-- src/components/ContentPageTemplate.vue -->
<template>
  <div class="content-page-template">
    <!-- 侧边栏 - 桌面端显示 -->
    <div class="sidebar" v-if="!isMobile">
      <div class="sidebar-header">
        <h3><i class="el-icon-folder-opened"></i> 文档目录</h3>
      </div>
      <div class="sidebar-content">
        <div class="section-container" v-for="section in contentData.sections" :key="section.id">
          <div
              class="section-header"
              :class="{ active: currentSection?.id === section.id }"
              @click="selectSection(section)"
          >
            <span class="section-title">{{ section.title }}</span>
            <el-icon v-if="currentSection?.id === section.id" class="arrow-icon">
              <arrow-down />
            </el-icon>
          </div>

          <transition name="slide">
            <div
                v-show="currentSection?.id === section.id"
                class="files-container"
            >
              <div
                  v-for="file in section.files"
                  :key="file.id"
                  class="file-item"
                  :class="{ active: currentFile?.id === file.id }"
                  @click="selectFile(file)"
              >
                <el-icon class="file-icon"><document /></el-icon>
                <span class="file-title">{{ file.title }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="content-header" v-if="contentData.title">
        <h1 class="page-title">{{ contentData.title }}</h1>
        <p class="page-description" v-if="contentData.description">{{ contentData.description }}</p>
      </div>

      <div class="content-container" ref="contentBody" @scroll="handleScroll">
        <div class="content-header-section" v-if="currentFile">
          <h2 class="content-title">{{ currentFile.title }}</h2>
          <div class="file-meta" v-if="currentFile.lastUpdated">
            <span class="last-updated">最后更新: {{ currentFile.lastUpdated }}</span>
          </div>
        </div>

        <div class="content-body" v-if="currentFile" v-html="currentFile.content"></div>

        <div class="empty-content" v-else>
          <div class="empty-illustration">
            <i class="el-icon-document" style="font-size: 64px; color: #ccc;"></i>
          </div>
          <h3>欢迎使用文档中心</h3>
          <p>请选择左侧的文档开始阅读</p>
          <el-button
              v-if="contentData.sections.length > 0 && !currentFile"
              type="primary"
              class="start-button"
              @click="selectFirstFile"
          >
            开始阅读
          </el-button>
        </div>
      </div>

      <!-- 内容页脚 -->
      <div class="content-footer" v-if="currentFile">
        <div class="navigation-buttons">
          <el-button
              class="custom-nav-button"
              @click="navigateToPrevious"
              :disabled="!previousFile"
          >
            <i class="el-icon-arrow-left"></i>
            上一篇
          </el-button>
          <div class="spacer"></div>
          <el-button
              class="custom-nav-button"
              @click="navigateToNext"
              :disabled="!nextFile"
          >
            下一篇
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>

        <div class="feedback-section">
          <p>这篇文章有帮助吗？</p>
          <div class="feedback-buttons">
            <el-button
                class="feedback-btn helpful-btn"
                @click="() => giveFeedback('helpful')"
            >
              <i class="el-icon-thumb"></i>
              有帮助
            </el-button>
            <el-button
                class="feedback-btn"
                @click="() => giveFeedback('not-helpful')"
            >
              <i class="el-icon-thumb"></i>
              没帮助
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧内容导航 - 桌面端显示 -->
    <div class="sidebar right-sidebar" v-if="!isMobile">
      <div class="sidebar-header">
        <h3><i class="el-icon-guide"></i> 内容导航</h3>
      </div>
      <div class="sidebar-content">
        <div v-if="currentFile && tocItems.length > 0" class="toc-container">
          <div
              v-for="(item, index) in tocItems"
              :key="index"
              class="toc-item"
              :class="[
                `toc-level-${item.level}`,
                { 'active': activeTocId === item.id }
              ]"
              @click="scrollToHeading(item.id)"
          >
            <i class="el-icon-arrow-right toc-arrow"></i>
            <span class="toc-text">{{ item.title }}</span>
          </div>
        </div>
        <div v-else class="toc-placeholder">
          <i class="el-icon-document"></i>
          <p>选择文档后显示目录</p>
        </div>
      </div>
    </div>

    <!-- 固钉按钮 - 右下角 -->
    <div class="float-button-container" v-if="currentFile">
      <div class="progress-indicator" v-if="scrollPercentage > 0">
        {{ scrollPercentage }}%
      </div>
      <el-button
          class="float-button"
          @click="scrollToTop"
          :class="{ 'visible': scrollPercentage > 5 }"
      >
        <el-icon><arrow-up /></el-icon>
      </el-button>
    </div>

    <!-- 移动端底部导航按钮 -->
    <div class="mobile-bottom-nav" v-if="isMobile">
      <el-button
          class="mobile-nav-btn"
          @click="openDrawer('sections')"
      >
        <i class="el-icon-folder-opened"></i>
        <span>文档目录</span>
      </el-button>
      <el-button
          class="mobile-nav-btn"
          @click="openDrawer('toc')"
          :disabled="!currentFile || tocItems.length === 0"
      >
        <i class="el-icon-guide"></i>
        <span>内容导航</span>
      </el-button>
    </div>

    <!-- 移动端抽屉 -->
    <el-drawer
        v-model="drawerVisible"
        :direction="drawerDirection"
        :size="drawerSize"
        :show-close="false"
        class="mobile-drawer"
        :before-close="beforeDrawerClose"
    >
      <template #header>
        <h3 class="drawer-header">
          <i :class="drawerIcon"></i>
          {{ drawerTitle }}
        </h3>
        <div class="close-drawer-wrapper" @click="closeDrawer">
          <div class="close-drawer-icon">
            <span></span>
            <span></span>
          </div>
        </div>
      </template>

      <div class="drawer-content">
        <!-- 文档目录抽屉内容 -->
        <div v-if="drawerType === 'sections'" class="sections-drawer">
          <div
              v-for="section in contentData.sections"
              :key="section.id"
              class="section-container"
          >
            <div
                class="section-header"
                :class="{ active: currentSection?.id === section.id }"
                @click="selectSection(section)"
            >
              <span class="section-title">{{ section.title }}</span>
              <el-icon v-if="currentSection?.id === section.id" class="arrow-icon">
                <arrow-down />
              </el-icon>
            </div>

            <transition name="slide">
              <div
                  v-show="currentSection?.id === section.id"
                  class="files-container"
              >
                <div
                    v-for="file in section.files"
                    :key="file.id"
                    class="file-item"
                    :class="{ active: currentFile?.id === file.id }"
                    @click="() => { selectFile(file); closeDrawer(); }"
                >
                  <el-icon class="file-icon"><document /></el-icon>
                  <span class="file-title">{{ file.title }}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- 内容导航抽屉内容 -->
        <div v-else-if="drawerType === 'toc'" class="toc-drawer">
          <div
              v-for="(item, index) in tocItems"
              :key="index"
              class="toc-item"
              :class="[
              `toc-level-${item.level}`,
              { 'active': activeTocId === item.id }
            ]"
              @click="() => { scrollToHeading(item.id); closeDrawer(); }"
          >
            <i class="el-icon-arrow-right toc-arrow"></i>
            <span class="toc-text">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch } from 'vue'
import { Document, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  contentData: {
    type: Object,
    required: true
  }
})

// 移动端检测
const isMobile = ref(window.innerWidth <= 768)
const drawerVisible = ref(false)
const drawerType = ref('sections') // 'sections' 或 'toc'

// 当前选中的章节
const currentSection = ref(null)

// 当前选中的文件
const currentFile = ref(null)

// 内容主体引用
const contentBody = ref(null)

// 活跃的目录项ID
const activeTocId = ref(null)

// 滚动百分比
const scrollPercentage = ref(0)

// 目录项 - 动态生成
const tocItems = computed(() => {
  if (!currentFile.value) return []

  // 如果文件有预定义的toc，则使用它
  if (currentFile.value.toc) {
    return currentFile.value.toc.map((item, index) => ({
      ...item,
      id: `toc-${index}`
    }))
  }

  // 否则从内容中提取标题
  const content = currentFile.value.content || ''
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content

  const headings = []
  const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')

  headingElements.forEach((heading, index) => {
    const title = heading.textContent.trim()
    const level = parseInt(heading.tagName.charAt(1))

    if (title) {
      headings.push({
        id: heading.id || `heading-${index}`,
        title,
        level
      })
    }
  })

  return headings
})

// 计算上一篇和下一篇文件
const previousFile = computed(() => {
  if (!currentFile.value || !props.contentData.sections) return null

  const allFiles = []
  props.contentData.sections.forEach(section => {
    if (section.files) {
      allFiles.push(...section.files)
    }
  })

  const currentIndex = allFiles.findIndex(file => file.id === currentFile.value.id)
  return currentIndex > 0 ? allFiles[currentIndex - 1] : null
})

const nextFile = computed(() => {
  if (!currentFile.value || !props.contentData.sections) return null

  const allFiles = []
  props.contentData.sections.forEach(section => {
    if (section.files) {
      allFiles.push(...section.files)
    }
  })

  const currentIndex = allFiles.findIndex(file => file.id === currentFile.value.id)
  return currentIndex < allFiles.length - 1 ? allFiles[currentIndex + 1] : null
})

// 抽屉相关计算属性
const drawerDirection = computed(() => isMobile.value ? 'btt' : 'rtl')
const drawerSize = computed(() => isMobile.value ? '80%' : '300px')
const drawerTitle = computed(() => {
  if (drawerType.value === 'sections') return '文档目录'
  if (drawerType.value === 'toc') return '内容导航'
  return ''
})
const drawerIcon = computed(() => {
  if (drawerType.value === 'sections') return 'el-icon-folder-opened'
  if (drawerType.value === 'toc') return 'el-icon-guide'
  return ''
})

// 组件挂载时初始化
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()

  // 默认选中第一个文件
  if (props.contentData.sections.length > 0 && !currentFile.value) {
    selectFirstFile()
  }
})

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 监听当前文件变化，自动滚动到顶部
watch(currentFile, () => {
  if (contentBody.value) {
    contentBody.value.scrollTop = 0
    scrollPercentage.value = 0
  }
})

// 处理窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  // 添加对抽屉状态的处理
  if (window.innerWidth > 768 && drawerVisible.value) {
    drawerVisible.value = false
  }
}

// 处理滚动事件
const handleScroll = () => {
  if (!contentBody.value) return

  const { scrollTop, scrollHeight, clientHeight } = contentBody.value
  const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
  scrollPercentage.value = isNaN(percentage) ? 0 : percentage

  const headings = contentBody.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const scrollPosition = scrollTop + 100

  // 从后向前查找当前可见的标题
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i]
    const headingTop = heading.offsetTop

    if (scrollPosition >= headingTop) {
      activeTocId.value = heading.id
      break
    }
  }
}

// 切换章节
const selectSection = (section) => {
  currentSection.value = section
  // 默认选中该章节的第一个文件
  if (section.files && section.files.length > 0) {
    currentFile.value = section.files[0]
  } else {
    currentFile.value = null
  }
}

// 切换文件
const selectFile = (file) => {
  // 找到文件所属的章节
  const section = props.contentData.sections.find(
      sec => sec.files && sec.files.some(f => f.id === file.id)
  )

  if (section) {
    currentSection.value = section
    currentFile.value = file
  }
}

// 选择第一个文件
const selectFirstFile = () => {
  if (props.contentData.sections.length > 0) {
    const firstSection = props.contentData.sections[0]
    selectSection(firstSection)
  }
}

// 滚动到指定标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element && contentBody.value) {
    const offsetTop = element.offsetTop
    contentBody.value.scrollTo({
      top: offsetTop - 20,
      behavior: 'smooth'
    })
    activeTocId.value = id
  }
}

// 滚动到顶部
const scrollToTop = () => {
  if (contentBody.value) {
    contentBody.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// 导航到上一篇/下一篇
const navigateToPrevious = () => {
  if (previousFile.value) {
    selectFile(previousFile.value)
  }
}

const navigateToNext = () => {
  if (nextFile.value) {
    selectFile(nextFile.value)
  }
}

// 用户反馈
const giveFeedback = (type) => {
  if (type === 'helpful') {
    ElMessage.success('感谢您的反馈！我们会继续努力提供更好的内容')
  } else {
    ElMessage.info('感谢您的反馈，我们会持续改进')
  }
}

// 打开抽屉
const openDrawer = (type) => {
  drawerType.value = type
  drawerVisible.value = true
}

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false
}

// 抽屉关闭前的处理
const beforeDrawerClose = (done) => {
  // 添加关闭动画效果
  const drawer = document.querySelector('.mobile-drawer');
  if (drawer) {
    drawer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    drawer.style.transform = 'translateY(100%)';
    drawer.style.opacity = '0';
  }

  setTimeout(() => {
    done();
  }, 300);
}
</script>

<style scoped>
.content-page-template {
  display: flex;
  min-height: calc(100vh - var(--navbar-height));
  width: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  position: relative;
  margin-top: var(--navbar-height);
  gap: 20px;
}

.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: var(--navbar-height);
  height: calc(100vh - var(--navbar-height));
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sidebar:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.sidebar-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--secondary-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-header h3 i {
  color: var(--accent-color);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.section-container {
  margin-bottom: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  font-weight: 600;
  color: var(--secondary-color);
  transition: all 0.3s ease;
  background-color: #ffffff;
  border-left: 4px solid transparent;
  position: relative;
  border-radius: 0 8px 8px 0;
  margin: 0 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.section-header:hover {
  background-color: #fff9f0;
  border-left-color: var(--accent-color);
  transform: translateX(5px);
}

.section-header.active {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-left-color: var(--accent-color);
  color: var(--accent-color);
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background: var(--border-color);
}

.section-title {
  font-size: var(--font-size-base);
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.section-header.active .arrow-icon {
  transform: rotate(180deg);
}

.files-container {
  background-color: #f9f9f9;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px 12px 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
  margin: 0 10px;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.file-item:hover {
  background-color: #fff5e6;
  border-left-color: var(--accent-color);
  transform: translateX(5px);
}

.file-item.active {
  background-color: #fff9f0;
  border-left-color: var(--accent-color);
  color: var(--accent-color);
  font-weight: 500;
}

.file-icon {
  font-size: 16px;
  color: var(--text-secondary);
}

.file-item.active .file-icon {
  color: var(--accent-color);
}

.file-title {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  flex: 1;
}

.file-item.active .file-title {
  color: var(--accent-color);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  min-height: calc(100vh - var(--navbar-height));
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.main-content:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.content-header {
  padding: 20px 30px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  color: var(--secondary-color);
  margin-bottom: 10px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 2px;
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin: 0;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.content-header-section {
  padding: 20px 30px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  flex-shrink: 0;
}

.content-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--secondary-color);
  margin: 0 0 10px 0;
  position: relative;
  padding-bottom: 10px;
}

.content-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 2px;
}

.file-meta {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.last-updated {
  display: inline-block;
  padding: 4px 10px;
  background-color: #f0f0f0;
  border-radius: 15px;
}

.content-body {
  flex: 1;
  padding: 30px;
  line-height: 1.8;
  color: var(--text-primary);
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-body :deep(h1) {
  font-size: var(--font-size-4xl);
  margin: 30px 0 20px 0;
  color: var(--secondary-color);
  font-weight: 700;
  position: relative;
  padding-bottom: 10px;
}

.content-body :deep(h1)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
  border-radius: 2px;
}

.content-body :deep(h2) {
  font-size: var(--font-size-3xl);
  margin: 25px 0 15px 0;
  color: var(--secondary-color);
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.content-body :deep(h3) {
  font-size: var(--font-size-2xl);
  margin: 20px 0 12px 0;
  color: var(--secondary-color);
  font-weight: 600;
}

.content-body :deep(h4) {
  font-size: var(--font-size-xl);
  margin: 18px 0 10px 0;
  color: var(--secondary-color);
  font-weight: 500;
}

.content-body :deep(h5) {
  font-size: var(--font-size-lg);
  margin: 16px 0 8px 0;
  color: var(--secondary-color);
  font-weight: 500;
}

.content-body :deep(h6) {
  font-size: var(--font-size-base);
  margin: 14px 0 6px 0;
  color: var(--secondary-color);
  font-weight: 500;
}

.content-body :deep(p) {
  margin: 15px 0;
  color: var(--text-primary);
  font-size: var(--font-size-base);
  line-height: 1.8;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  padding-left: 30px;
  margin: 15px 0;
}

.content-body :deep(li) {
  margin: 8px 0;
  color: var(--text-primary);
  line-height: 1.7;
}

.content-body :deep(strong) {
  color: var(--secondary-color);
  font-weight: 600;
}

.content-body :deep(a) {
  color: var(--accent-color);
  text-decoration: none;
  border-bottom: 1px dashed var(--accent-color);
  transition: all 0.3s ease;
}

.content-body :deep(a:hover) {
  color: #8a6d42;
  border-bottom: 1px solid #8a6d42;
}

.content-body :deep(code) {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-sm);
}

.content-body :deep(pre) {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid var(--border-color);
}

.content-body :deep(blockquote) {
  border-left: 4px solid var(--accent-color);
  padding: 10px 20px;
  margin: 20px 0;
  background-color: #fff9f0;
  border-radius: 0 4px 4px 0;
}

.empty-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
  padding: 20px;
}

.empty-illustration {
  margin-bottom: 20px;
  opacity: 0.7;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.empty-content h3 {
  font-size: var(--font-size-2xl);
  color: var(--secondary-color);
  margin-bottom: 10px;
}

.empty-content p {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.start-button {
  border-radius: 25px;
  padding: 12px 30px;
  font-size: var(--font-size-base);
  font-weight: 500;
  background: linear-gradient(135deg, var(--accent-color), #d4b68c);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(186, 149, 92, 0.3);
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(186, 149, 92, 0.4);
}

.right-sidebar {
  width: 250px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: var(--navbar-height);
  height: calc(100vh - var(--navbar-height));
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.right-sidebar:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.right-sidebar .sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.right-sidebar .sidebar-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--secondary-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.right-sidebar .sidebar-header h3 i {
  color: var(--accent-color);
}

.right-sidebar .sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.right-sidebar .toc-container {
  padding: 0;
}

.toc-item {
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  margin-bottom: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.toc-item:hover {
  background-color: #fff9f0;
  color: var(--accent-color);
  transform: translateX(5px);
}

.toc-item.active {
  background-color: #fff9f0;
  color: var(--accent-color);
  font-weight: 600;
}

.toc-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent-color);
  border-radius: 0 2px 2px 0;
}

.toc-level-1 {
  font-weight: 600;
  padding-left: 15px;
}

.toc-level-2 {
  padding-left: 30px;
}

.toc-level-3 {
  padding-left: 45px;
}

.toc-level-4 {
  padding-left: 60px;
}

.toc-level-5 {
  padding-left: 75px;
}

.toc-level-6 {
  padding-left: 90px;
}

.toc-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-arrow {
  margin-right: 8px;
  font-size: 12px;
  opacity: 0.7;
}

.toc-placeholder {
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.toc-placeholder i {
  font-size: 32px;
  color: var(--accent-color);
  opacity: 0.7;
}

/* 添加过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* 内容页脚 */
.content-footer {
  padding: 20px 30px;
  border-top: 1px solid var(--border-color);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  flex-shrink: 0;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 20px;
}

.spacer {
  flex: 1;
}

/* 自定义导航按钮样式 */
.custom-nav-button {
  flex: 1;
  border-radius: 25px !important;
  padding: 10px 20px !important;
  font-size: var(--font-size-base) !important;
  font-weight: 500 !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  border: 1px solid var(--border-color) !important;
  color: #2A3535 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  white-space: nowrap;
}

.custom-nav-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  border-color: #2A3535 !important;
  background: linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%) !important;
}

.custom-nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(42, 53, 53, 0.1), rgba(42, 53, 53, 0.05));
  border-radius: 25px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.custom-nav-button:hover::before {
  opacity: 1;
}

.feedback-section {
  text-align: center;
  padding-top: 20px;
  border-top: 1px dashed var(--border-color);
}

.feedback-section p {
  margin: 0 0 15px 0;
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

.feedback-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.feedback-btn {
  border-radius: 20px;
  padding: 8px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.feedback-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.helpful-btn {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%) !important;
  border-color: #4caf50 !important;
  color: #2e7d32 !important;
}

/* 移动端底部导航 */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%);
  border-top: 1px solid var(--border-color);
  padding: 10px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  backdrop-filter: blur(10px);
  height: 60px;
}

.mobile-nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: var(--font-size-xs);
  gap: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  font-weight: 500;
}

.mobile-nav-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%);
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mobile-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-nav-btn i {
  font-size: 18px;
  color: var(--accent-color);
}

.mobile-nav-btn:disabled i {
  color: #ccc;
}

/* 抽屉样式 */
.mobile-drawer {
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15);
}

.mobile-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: var(--font-size-2xl);
  color: var(--secondary-color);
  font-weight: 700;
  padding: 0;
}

.close-drawer-wrapper {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.close-drawer-wrapper:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.close-drawer-icon {
  position: relative;
  width: 20px;
  height: 20px;
}

.close-drawer-icon span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: var(--secondary-color);
  border-radius: 2px;
  transform-origin: center;
}

.close-drawer-icon span:first-child {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-drawer-icon span:last-child {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.drawer-content {
  height: 100%;
  overflow-y: auto;
  padding: 10px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.sections-drawer,
.toc-drawer {
  padding: 0;
}

/* 文档目录样式 - 与导航栏样式保持一致 */
.section-container {
  margin-bottom: 0;
}

/* 固钉按钮样式 */
.float-button-container {
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.progress-indicator {
  background: linear-gradient(135deg, var(--accent-color), #d4b68c);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.progress-indicator:not(:empty) {
  opacity: 1;
  transform: translateY(0);
}

.float-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), #d4b68c);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.float-button.visible {
  opacity: 1;
  transform: translateY(0);
}

.float-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  background: linear-gradient(135deg, #d4b68c, var(--accent-color));
}

.float-button:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .right-sidebar {
    display: none;
  }

  .sidebar {
    width: 220px;
  }

  .content-page-template {
    gap: 15px;
  }
}

@media (max-width: 992px) {
  .content-page-template {
    flex-direction: column;
    height: auto;
    width: 100%;
    margin-top: var(--navbar-height);
    gap: 15px;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: auto;
    height: auto;
  }

  .main-content {
    min-height: 500px;
  }

  .content-body {
    padding: 20px;
  }

  .content-title {
    font-size: var(--font-size-2xl);
  }

  .page-title {
    font-size: var(--font-size-3xl);
  }

  .right-sidebar {
    display: none;
  }

  .navigation-buttons {
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }

  .custom-nav-button {
    width: auto;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .content-page-template {
    padding: 0;
    margin-top: var(--navbar-height);
    gap: 10px;
    padding-bottom: 60px; /* 为底部导航留出空间 */
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }

  .page-description {
    font-size: var(--font-size-base);
  }

  .content-page-template {
    gap: 10px;
  }

  .sidebar-content {
    padding: 10px 0;
  }

  .section-header {
    padding: 12px 15px;
  }

  .file-item {
    padding: 10px 15px 10px 25px;
  }

  .content-header {
    padding: 15px 20px;
  }

  .content-header-section {
    padding: 15px 20px;
  }

  .content-title {
    font-size: var(--font-size-xl);
  }

  .content-body {
    padding: 20px 15px;
  }

  .content-body :deep(h1) {
    font-size: var(--font-size-3xl);
  }

  .content-body :deep(h2) {
    font-size: var(--font-size-2xl);
  }

  .content-body :deep(h3) {
    font-size: var(--font-size-xl);
  }

  .content-body :deep(p) {
    font-size: var(--font-size-sm);
  }

  .feedback-buttons {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .feedback-btn {
    width: 100%;
    max-width: 200px;
  }

  .custom-nav-button {
    padding: 8px 16px !important;
    font-size: var(--font-size-sm) !important;
  }

  /* 隐藏侧边栏 */
  .sidebar {
    display: none;
  }

  /* 小屏幕中保持导航按钮在同一行并铺满整行 */
  .navigation-buttons {
    flex-direction: row;
    gap: 10px;
  }

  .custom-nav-button {
    flex: 1;
    justify-content: center;
  }

  /* 响应式调整 */
  .close-drawer-wrapper {
    width: 32px;
    height: 32px;
    right: 12px;
  }

  .close-drawer-icon {
    width: 18px;
    height: 18px;
  }

  /* 固钉按钮移动端适配 */
  .float-button-container {
    right: 15px;
    bottom: 80px;
  }

  .float-button {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .content-page-template {
    padding: 0;
    margin-top: var(--navbar-height);
    padding-bottom: 60px;
  }

  .page-title {
    font-size: var(--font-size-xl);
  }

  .page-description {
    font-size: var(--font-size-sm);
  }

  .section-title {
    font-size: var(--font-size-sm);
  }

  .file-title {
    font-size: var(--font-size-xs);
  }

  .content-title {
    font-size: var(--font-size-lg);
  }

  .content-header {
    padding: 15px;
  }

  .content-header-section {
    padding: 15px;
  }

  .content-body {
    padding: 15px;
  }

  .custom-nav-button,
  .feedback-btn {
    padding: 6px 15px !important;
    font-size: var(--font-size-sm) !important;
  }

  .empty-content h3 {
    font-size: var(--font-size-xl);
  }

  .empty-content p {
    font-size: var(--font-size-sm);
  }

  /* 超小屏幕进一步优化 */
  .navigation-buttons {
    flex-direction: row;
    gap: 8px;
  }

  .custom-nav-button {
    padding: 6px 12px !important;
    font-size: var(--font-size-xs) !important;
  }

  .mobile-bottom-nav {
    padding: 8px;
  }

  .mobile-nav-btn {
    padding: 8px 5px;
    font-size: var(--font-size-xs);
    gap: 3px;
  }

  .close-drawer-wrapper {
    width: 28px;
    height: 28px;
    right: 10px;
  }

  .close-drawer-icon {
    width: 16px;
    height: 16px;
  }

  .close-drawer-icon span {
    height: 2px;
  }

  /* 固钉按钮超小屏适配 */
  .float-button-container {
    right: 10px;
    bottom: 70px;
  }

  .float-button {
    width: 32px;
    height: 32px;
  }
}

/* 新增移动端优化样式 */
@media (max-width: 768px) {
  /* 优化抽屉内容样式 */
  .drawer-content {
    padding: 10px 0;
  }

  .sections-drawer,
  .toc-drawer {
    padding: 0 10px;
  }

  /* 优化抽屉中的章节标题 */
  .section-header {
    padding: 16px 12px;
    margin: 0 5px 8px 5px;
    font-size: var(--font-size-base);
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  /* 优化抽屉中的文件项 */
  .file-item {
    padding: 14px 15px 14px 25px;
    margin: 0 5px 5px 5px;
    border-radius: 6px;
  }

  .file-title {
    font-size: var(--font-size-sm);
  }

  /* 优化抽屉中的目录项 */
  .toc-item {
    padding: 12px 15px;
    margin-bottom: 5px;
    font-size: var(--font-size-sm);
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  }

  .toc-level-1 {
    padding-left: 12px;
  }

  .toc-level-2 {
    padding-left: 24px;
  }

  .toc-level-3 {
    padding-left: 36px;
  }

  .toc-level-4 {
    padding-left: 48px;
  }

  .toc-level-5 {
    padding-left: 60px;
  }

  .toc-level-6 {
    padding-left: 72px;
  }

  /* 优化抽屉头部 */
  .drawer-header {
    font-size: var(--font-size-xl);
    padding: 0 20px;
  }

  /* 优化空状态页面 */
  .empty-content {
    min-height: 300px;
    padding: 15px;
  }

  .empty-illustration {
    margin-bottom: 15px;
  }

  .empty-content h3 {
    font-size: var(--font-size-xl);
    margin-bottom: 8px;
  }

  .empty-content p {
    font-size: var(--font-size-sm);
    margin-bottom: 15px;
  }

  .start-button {
    padding: 10px 20px;
    font-size: var(--font-size-sm);
  }

  /* 优化内容区域 */
  .content-header {
    padding: 15px;
  }

  .page-title {
    font-size: var(--font-size-xl);
    margin-bottom: 8px;
  }

  .page-description {
    font-size: var(--font-size-base);
  }

  .content-header-section {
    padding: 15px;
  }

  .content-title {
    font-size: var(--font-size-lg);
  }

  .content-body {
    padding: 15px;
  }

  .content-body :deep(h1) {
    font-size: var(--font-size-2xl);
    margin: 25px 0 15px 0;
  }

  .content-body :deep(h2) {
    font-size: var(--font-size-xl);
    margin: 20px 0 12px 0;
  }

  .content-body :deep(h3) {
    font-size: var(--font-size-lg);
    margin: 18px 0 10px 0;
  }

  .content-body :deep(p) {
    font-size: var(--font-size-sm);
    margin: 12px 0;
  }

  .content-body :deep(ul),
  .content-body :deep(ol) {
    padding-left: 20px;
    margin: 12px 0;
  }

  .content-body :deep(li) {
    margin: 6px 0;
    font-size: var(--font-size-sm);
  }

  /* 优化内容页脚 */
  .content-footer {
    padding: 15px;
  }

  .navigation-buttons {
    gap: 10px;
    margin-bottom: 15px;
  }

  .custom-nav-button {
    padding: 8px 12px !important;
    font-size: var(--font-size-sm) !important;
  }

  .feedback-section p {
    font-size: var(--font-size-sm);
    margin-bottom: 12px;
  }

  .feedback-buttons {
    gap: 10px;
  }

  .feedback-btn {
    padding: 6px 15px;
    font-size: var(--font-size-sm);
  }

  /* 优化移动端底部导航 */
  .mobile-bottom-nav {
    padding: 6px 8px;
    height: 56px;
    border-top: none;
  }

  .mobile-nav-btn {
    padding: 6px 0;
    font-size: var(--font-size-xs);
    gap: 3px;
    border-radius: 8px;
  }

  .mobile-nav-btn i {
    font-size: 16px;
  }

  .mobile-nav-btn span {
    font-size: 10px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 360px) {
  .page-title {
    font-size: var(--font-size-lg);
  }

  .section-title {
    font-size: var(--font-size-xs);
  }

  .file-title {
    font-size: var(--font-size-xs);
  }

  .content-title {
    font-size: var(--font-size-base);
  }

  .navigation-buttons {
    gap: 5px;
  }

  .custom-nav-button {
    padding: 5px 8px !important;
    font-size: var(--font-size-xs) !important;
  }

  .mobile-bottom-nav {
    padding: 5px;
    height: 50px;
  }

  .mobile-nav-btn {
    padding: 5px 0;
    font-size: 10px;
    gap: 2px;
  }

  .mobile-nav-btn i {
    font-size: 14px;
  }
}
</style>
