<!-- src/components/GlobalSearch.vue -->
<template>
  <div class="global-search">
    <el-input
        v-model="searchQuery"
        placeholder="搜索文档..."
        class="global-search-input"
        @focus="isSearchFocused = true"
        @blur="handleBlur"
        @input="handleSearch"
        @keyup.enter="handleEnter"
    >
      <template #prefix>
        <el-icon>
          <search/>
        </el-icon>
      </template>
    </el-input>

    <transition name="el-zoom-in-top">
      <div v-show="isSearchFocused && searchQuery && (searchResults.length > 0 || searchQuery.trim() !== '')" class="global-search-results">
        <div
            v-for="(result, index) in searchResults"
            :key="result.id"
            class="global-search-result-item"
            :class="{ active: activeIndex === index }"
            @click="selectResult(result)"
            @mouseenter="activeIndex = index"
        >
          <div class="result-title" v-html="result.highlightedTitle"></div>
          <div class="result-content" v-html="result.highlightedContent"></div>
          <div class="result-path">{{ result.path }}</div>
        </div>
        <div v-if="searchResults.length === 0 && searchQuery.trim() !== ''" class="no-results">
          未找到相关结果
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import searchService from '@/services/searchService.js'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])
const isSearchFocused = ref(false)
const activeIndex = ref(-1)
let searchTimeout = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim() === '') {
      searchResults.value = []
      activeIndex.value = -1
      return
    }

    searchResults.value = searchService.search(searchQuery.value)
    activeIndex.value = -1
  }, 300)
}

const handleBlur = () => {
  // 延迟隐藏搜索结果，确保点击结果时不会立即隐藏
  setTimeout(() => {
    isSearchFocused.value = false
  }, 200)
}

const handleEnter = () => {
  if (searchResults.value.length > 0 && activeIndex.value >= 0) {
    selectResult(searchResults.value[activeIndex.value])
  }
}

const selectResult = (result) => {
  searchQuery.value = ''
  searchResults.value = []
  isSearchFocused.value = false
  activeIndex.value = -1

  // 跳转到搜索结果对应的页面
  router.push(result.path)
}

// 监听键盘事件用于导航搜索结果
const handleKeyDown = (event) => {
  if (!isSearchFocused.value || searchResults.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % searchResults.value.length
      break
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = (activeIndex.value - 1 + searchResults.value.length) % searchResults.value.length
      break
    case 'Enter':
      event.preventDefault()
      if (activeIndex.value >= 0) {
        selectResult(searchResults.value[activeIndex.value])
      }
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<style scoped>
.global-search {
  position: relative;
  width: 300px;
}

.global-search-input {
  width: 100%;
}

.global-search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--primary-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  max-height: 70vh;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 5px;
}

.global-search-result-item {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.global-search-result-item:last-child {
  border-bottom: none;
}

.global-search-result-item:hover,
.global-search-result-item.active {
  background-color: #f9f9f9;
}

.result-title {
  font-weight: bold;
  color: var(--secondary-color);
  margin-bottom: 5px;
}

.result-content {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 5px;
}

.result-path {
  color: #999;
  font-size: 12px;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .global-search {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .global-search {
    width: 150px;
  }
}
</style>
