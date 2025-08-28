<!-- src/components/GlobalSearch.vue -->
<template>
  <div class="global-search" ref="searchContainerRef">
    <el-input
        v-model="searchText"
        placeholder="搜索文档..."
        clearable
        @input="performSearch"
        @clear="clearSearch"
        @keyup.enter="handleSearch"
        @focus="onSearchFocus"
        class="global-search-input"
        :suffix-icon="searchLoading ? 'Loading' : ''"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <Teleport to="body">
      <div
          v-show="showSearchResults && searchResults.length > 0"
          class="global-search-results"
          :style="searchResultsStyle"
          @mouseenter="onResultsHover"
          @mouseleave="onResultsLeave"
      >
        <div
            v-for="(result, index) in searchResults"
            :key="result.id"
            class="global-search-result-item"
            :class="{ 'active': activeResultIndex === index }"
            @click="jumpToSearchResult(result)"
            @mouseenter="activeResultIndex = index"
        >
          <div class="result-title">{{ result.title }}</div>
          <div class="result-content" v-html="result.preview"></div>
          <div class="result-path">{{ result.pageTitle || '未知页面' }}</div>
        </div>
      </div>

      <div
          v-show="showSearchResults && searchResults.length === 0 && searchText"
          class="no-results"
          :style="searchResultsStyle"
      >
        <el-icon class="no-results-icon"><Search /></el-icon>
        <div class="no-results-text">未找到相关内容</div>
        <div class="no-results-hint">试试其他关键词</div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue'
import {Search} from '@element-plus/icons-vue'
import searchService from '@/services/searchService.js'
import router from '@/router/router.js'

export default {
  name: 'GlobalSearch',
  setup() {
    const searchText = ref('')
    const searchResults = ref([])
    const showSearchResults = ref(false)
    const searchContainerRef = ref(null)
    const windowWidth = ref(window.innerWidth)
    const activeResultIndex = ref(-1)
    const isResultsHovered = ref(false)
    const searchLoading = ref(false)
    const searchResultsPosition = ref({})

    // 监听窗口大小变化
    const handleResize = () => {
      windowWidth.value = window.innerWidth
      // 更新搜索结果框位置
      updateSearchResultsPosition()
      // 窗口大小改变时隐藏搜索结果
      showSearchResults.value = false
    }

    // 更新搜索结果框位置
    const updateSearchResultsPosition = () => {
      if (!searchContainerRef.value) {
        searchResultsPosition.value = {
          position: 'fixed',
          top: '60px',
          left: '10px',
          right: '10px',
          zIndex: '9999'
        }
        return
      }

      const rect = searchContainerRef.value.getBoundingClientRect()
      const isMobile = window.innerWidth <= 768

      if (isMobile) {
        // 移动端 - 横向铺满屏幕，位置固定
        searchResultsPosition.value = {
          position: 'fixed',
          top: rect.bottom + 8 + 'px',
          left: '10px',
          right: '10px',
          zIndex: '9999',
          maxWidth: 'none'
        }
      } else {
        // 中等及以上屏幕 - 宽度与搜索框保持一致，并跟随搜索框位置
        searchResultsPosition.value = {
          position: 'fixed',
          top: rect.bottom + 8 + 'px',
          left: rect.left + 'px',
          width: rect.width + 'px',
          zIndex: '9999'
        }
      }
    }

    // 计算搜索结果面板的位置和样式
    const searchResultsStyle = computed(() => {
      return searchResultsPosition.value
    })

    // 搜索方法
    const performSearch = () => {
      const text = searchText.value;
      if (!text || typeof text !== 'string' || !text.trim()) {
        searchResults.value = [];
        showSearchResults.value = false;
        activeResultIndex.value = -1;
        return;
      }

      searchLoading.value = true
      // 模拟异步搜索
      setTimeout(() => {
        searchResults.value = searchService.search(text);
        showSearchResults.value = true;
        activeResultIndex.value = -1;
        searchLoading.value = false
      }, 100)
    };

    // 清空搜索
    const clearSearch = () => {
      searchText.value = ''
      searchResults.value = []
      showSearchResults.value = false
      activeResultIndex.value = -1
    }

    // 处理搜索
    const handleSearch = () => {
      if (activeResultIndex.value >= 0 && activeResultIndex.value < searchResults.value.length) {
        jumpToSearchResult(searchResults.value[activeResultIndex.value])
      } else if (searchResults.value.length > 0) {
        jumpToSearchResult(searchResults.value[0])
      }
    }

    // 处理键盘事件
    const handleKeyDown = (event) => {
      if (!showSearchResults.value) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (searchResults.value.length > 0) {
            activeResultIndex.value = (activeResultIndex.value + 1) % searchResults.value.length;
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (searchResults.value.length > 0) {
            activeResultIndex.value = activeResultIndex.value <= 0
                ? searchResults.value.length - 1
                : activeResultIndex.value - 1;
          }
          break;
        case 'Escape':
          showSearchResults.value = false;
          activeResultIndex.value = -1;
          break;
      }
    }

    // 跳转到搜索结果
    const jumpToSearchResult = (result) => {
      showSearchResults.value = false
      searchText.value = ''
      activeResultIndex.value = -1

      try {
        // 获取目标路径
        let targetPath = result.pagePath || '/';

        // 直接跳转到目标页面，不进行页面内滚动
        router.push(targetPath).then(() => {
          // 在页面跳转后，设置当前文件为搜索结果对应的文件
          // 通过事件总线或全局状态管理来实现
          setTimeout(() => {
            // 发送自定义事件，通知 ContentPageTemplate 组件设置当前文件
            window.dispatchEvent(new CustomEvent('search-result-selected', {
              detail: { fileId: result.id }
            }));
          }, 100);
        }).catch(err => {
          console.error('路由跳转失败:', err);
        });
      } catch (error) {
        console.error('跳转过程中发生错误:', error);
      }
    }

    // 点击其他地方隐藏搜索结果
    const handleClickOutside = (event) => {
      if (searchContainerRef.value && !searchContainerRef.value.contains(event.target) && !isResultsHovered.value) {
        showSearchResults.value = false
        activeResultIndex.value = -1
      }
    }

    // 搜索框聚焦事件
    const onSearchFocus = () => {
      if (searchText.value && searchResults.value.length > 0) {
        showSearchResults.value = true
      }
    }

    // 鼠标进入搜索结果
    const onResultsHover = () => {
      isResultsHovered.value = true
    }

    // 鼠标离开搜索结果
    const onResultsLeave = () => {
      isResultsHovered.value = false
    }

    // 监听搜索框位置变化
    const observeSearchContainer = () => {
      if (!searchContainerRef.value) return

      const observer = new MutationObserver(() => {
        // 当搜索框位置发生变化时更新结果框位置
        if (showSearchResults.value) {
          updateSearchResultsPosition()
        }
      })

      observer.observe(searchContainerRef.value, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false
      })

      return observer
    }

    let mutationObserver = null

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
      document.addEventListener('keydown', handleKeyDown)

      // 初始更新位置
      updateSearchResultsPosition()

      // 监听搜索框变化
      mutationObserver = observeSearchContainer()
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleKeyDown)

      if (mutationObserver) {
        mutationObserver.disconnect()
      }
    })

    // 当搜索结果显示状态改变时更新位置
    watch(showSearchResults, (newVal) => {
      if (newVal) {
        // 延迟一小段时间确保DOM已经更新
        setTimeout(() => {
          updateSearchResultsPosition()
        }, 0)
      }
    })

    return {
      searchText,
      searchResults,
      showSearchResults,
      searchContainerRef,
      searchResultsStyle,
      activeResultIndex,
      performSearch,
      clearSearch,
      handleSearch,
      jumpToSearchResult,
      onSearchFocus,
      onResultsHover,
      onResultsLeave,
      searchLoading,
    }
  },
  components: {
    Search
  }
}
</script>

<style scoped>
/* 全局搜索样式 */
.global-search {
  position: relative;
  width: 300px;
  max-width: 100%;
}

.global-search-input {
  width: 100%;
}

.global-search-results {
  background-color: var(--primary-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  max-height: 70vh;
  overflow-y: auto;
  z-index: 9999;
}

.global-search-result-item {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
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
  font-size: var(--font-size-base);
}

.result-content {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: 5px;
}

.result-path {
  color: #999;
  font-size: var(--font-size-xs);
}

.no-results {
  background-color: var(--primary-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  padding: 30px;
  text-align: center;
}

.no-results-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 10px;
}

.no-results-text {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin-bottom: 5px;
}

.no-results-hint {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* 搜索高亮效果 */
.search-highlight {
  animation: highlight 2s ease;
}

@keyframes highlight {
  0% {
    background-color: rgba(186, 149, 92, 0.3);
  }
  100% {
    background-color: transparent;
  }
}

/* 响应式设计 */
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
