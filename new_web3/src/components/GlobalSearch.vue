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
      <div v-show="isSearchFocused && (searchResults.length > 0 || searchQuery.trim() !== '')" class="global-search-results">
        <div
            v-for="(result, index) in searchResults"
            :key="result.id"
            class="global-search-result-item"
            :class="{ active: activeIndex === index }"
            @click="selectResult(result)"
            @mouseenter="activeIndex = index"
        >
          <!-- 显示面包屑路径 -->
          <div class="result-breadcrumb" v-if="result.fullPath && Array.isArray(result.fullPath)">
            <span v-for="(path, i) in result.fullPath" :key="i">
              <span v-if="i > 0"> > </span>
              <span :class="{
                'highlight-breadcrumb': path.toLowerCase().includes(searchQuery.toLowerCase())
              }">{{ path }}</span>
            </span>
          </div>
          
          <div class="result-title" v-html="highlightText(result.title, searchQuery)"></div>
          <div class="result-content" v-html="getExcerpt(result.content, searchQuery)"></div>
          <div class="result-path">
            <span v-if="result.type === 'file'">文件</span>
            <span v-else-if="result.type === 'section'">章节</span>
            <span v-else>页面</span>
          </div>
        </div>
        <div v-if="searchResults.length === 0 && searchQuery.trim() !== ''" class="no-results">
          <div class="no-results-icon"><search/></div>
          <div class="no-results-text">未找到相关结果</div>
          <div class="no-results-hint">试试其他关键词</div>
          <div class="search-suggestions">
            <div v-for="suggestion in getSearchSuggestions" :key="suggestion" class="suggestion-item">
              {{ suggestion }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import searchService from '@/services/searchService.js'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])
const isSearchFocused = ref(false)
const activeIndex = ref(-1)
const searchTimeout = ref(null)

// 获取搜索建议
const getSearchSuggestions = computed(() => {
  if (!searchQuery.value) return []
  
  const suggestions = new Set()
  const normalizedQuery = searchQuery.value.toLowerCase()
  
  // 从索引中提取相关建议
  searchService.searchIndex.forEach(item => {
    if (item.title && item.title.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(item.title)
    }
  })
  
  return Array.from(suggestions).slice(0, 3)
})

// 获取内容摘要
const getExcerpt = (content, query, length = 100) => {
  if (!content) return ''
  
  const normalizedContent = content.toLowerCase()
  const normalizedQuery = query.toLowerCase()
  const queryIndex = normalizedContent.indexOf(normalizedQuery)
  
  if (queryIndex === -1) {
    return content.length > length ? content.substring(0, length) + '...' : content
  }
  
  const start = Math.max(0, queryIndex - Math.floor(length / 2))
  const end = Math.min(content.length, start + length)
  let excerpt = content.substring(start, end)
  
  if (start > 0) {
    excerpt = '...' + excerpt
  }
  
  if (end < content.length) {
    excerpt = excerpt + '...'
  }
  
  return excerpt
}

// 高亮匹配文本
const highlightText = (text, query) => {
  if (!text || !query) return text
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return text.replace(regex, '<mark class="highlight">$1</mark>')
}

// 转义正则表达式特殊字符
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    if (String(searchQuery.value).trim() === '') {
      searchResults.value = []
      activeIndex.value = -1
      return
    }
    
    searchResults.value = searchService.search(searchQuery.value)
    activeIndex.value = -1
  }, 300)
}

const handleBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false
  }, 200)
}

const handleEnter = () => {
  if (searchResults.value.length > 0 && activeIndex.value >= 0) {
    selectResult(searchResults.value[activeIndex.value])
  } else if (searchResults.value.length > 0) {
    selectResult(searchResults.value[0])
  }
}

const selectResult = (result) => {
  searchQuery.value = ''
  searchResults.value = []
  isSearchFocused.value = false
  activeIndex.value = -1
  
  if (result.path) {
    router.push(result.path)
  }
}

// 键盘导航优化
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
    case 'Escape':
      isSearchFocused.value = false
      activeIndex.value = -1
      break
  }
}

// 添加键盘事件监听器
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
.result-breadcrumb {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-bottom: 3px;
}

.highlight-breadcrumb {
  background-color: #fff3cd;
  border-radius: 3px;
  padding: 1px 3px;
}

.search-suggestions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
  text-align: left;
}

.suggestion-item {
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
  color: var(--accent-color);
}
</style>