<!-- src/components/TreeMenu.vue -->
<template>
  <div class="tree-menu">
    <div v-for="item in sections" :key="item.id" class="tree-item">
      <div
          v-if="item.files || item.children"
          class="tree-item-header"
          :class="{ active: isItemActive(item) }"
          @click="toggleItem(item)"
      >
        <span class="tree-item-title">{{ item.title }}</span>
        <el-icon v-if="item.files || item.children" class="arrow-icon" :class="{ expanded: expandedItems.includes(item.id) }">
          <arrow-down />
        </el-icon>
      </div>

      <div
          v-else
          class="tree-item-header file-item"
          :class="{ active: currentFile && currentFile.id === item.id }"
          @click="$emit('select-file', item)"
      >
        <span class="tree-item-title">{{ item.title }}</span>
      </div>

      <transition name="slide">
        <div v-show="expandedItems.includes(item.id)" v-if="item.files || item.children" class="tree-item-children">
          <TreeMenu
              v-if="item.children"
              :sections="item.children"
              :current-file="currentFile"
              @select-file="$emit('select-file', $event)"
          />
          <div v-else class="files-container">
            <div
                v-for="file in item.files"
                :key="file.id"
                class="file-item"
                :class="{ active: currentFile && currentFile.id === file.id }"
                @click="$emit('select-file', file)"
            >
              <el-icon class="file-icon"><document /></el-icon>
              <span class="file-title">{{ file.title }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Document, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    default: () => []
  },
  currentFile: {
    type: Object,
    default: null
  }
})

defineEmits(['select-file'])

const expandedItems = ref([])

const toggleItem = (item) => {
  const index = expandedItems.value.indexOf(item.id)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(item.id)
  }
}

const isItemActive = (item) => {
  if (!props.currentFile) return false

  // 检查当前文件是否在该item的子项中
  const checkChildren = (children) => {
    if (!children) return false
    return children.some(child => {
      if (child.id === props.currentFile.id) return true
      if (child.files) {
        return child.files.some(file => file.id === props.currentFile.id)
      }
      if (child.children) {
        return checkChildren(child.children)
      }
      return false
    })
  }

  return checkChildren([item])
}

onMounted(() => {
  // 默认展开包含当前文件的项
  if (props.currentFile && props.sections) {
    const findAndExpandParents = (items) => {
      items.forEach(item => {
        if (item.files) {
          const hasCurrentFile = item.files.some(file => file.id === props.currentFile.id)
          if (hasCurrentFile) {
            if (!expandedItems.value.includes(item.id)) {
              expandedItems.value.push(item.id)
            }
          }
        }

        if (item.children) {
          const hasCurrentFile = item.children.some(child =>
              child.id === props.currentFile.id ||
              (child.files && child.files.some(file => file.id === props.currentFile.id))
          )

          if (hasCurrentFile) {
            if (!expandedItems.value.includes(item.id)) {
              expandedItems.value.push(item.id)
            }
            findAndExpandParents(item.children)
          }
        }
      })
    }

    findAndExpandParents(props.sections)
  }
})
</script>

<style scoped>
.tree-menu {
  width: 100%;
}

.tree-item {
  margin-bottom: 5px;
}

.tree-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  font-weight: 500;
  color: var(--secondary-color);
  transition: all 0.3s ease;
  background-color: #ffffff;
  border-left: 3px solid transparent;
  position: relative;
  border-radius: 0 6px 6px 0;
  margin: 0 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.tree-item-header:hover {
  background-color: #fff9f0;
  border-left-color: var(--accent-color);
  transform: translateX(3px);
}

.tree-item-header.active {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-left-color: var(--accent-color);
  color: var(--accent-color);
  font-weight: 600;
}

.tree-item-title {
  font-size: var(--font-size-sm);
  flex: 1;
  text-align: left;
}

.arrow-icon {
  transition: transform 0.3s ease;
  font-size: 14px;
}

.arrow-icon.expanded {
  transform: rotate(180deg);
}

.tree-item-children {
  background-color: #f9f9f9;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  overflow: hidden;
}

.files-container {
  padding: 5px 0;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px 10px 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
  margin: 0 10px 5px 10px;
  border-radius: 0 6px 6px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.file-item:hover {
  background-color: #fff5e6;
  border-left-color: var(--accent-color);
  transform: translateX(3px);
}

.file-item.active {
  background-color: #fff9f0;
  border-left-color: var(--accent-color);
  color: var(--accent-color);
  font-weight: 500;
}

.file-icon {
  font-size: 14px;
  color: var(--text-secondary);
}

.file-item.active .file-icon {
  color: var(--accent-color);
}

.file-title {
  font-size: var(--font-size-xs);
  color: var(--text-primary);
  flex: 1;
  text-align: left;
}

.file-item.active .file-title {
  color: var(--accent-color);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .tree-item-header {
    padding: 14px 12px;
    margin: 0 5px 5px 5px;
    font-size: var(--font-size-base);
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .file-item {
    padding: 12px 15px 12px 25px;
    margin: 0 5px 5px 5px;
    border-radius: 6px;
  }

  .file-title {
    font-size: var(--font-size-sm);
  }
}
</style>
