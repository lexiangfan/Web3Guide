<!-- src/components/CustomDialog.vue -->
<template>
  <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
    <div class="dialog-container" @click.stop>
      <div class="dialog-header">
        <h3>{{ title }}</h3>
        <button class="dialog-close" @click="closeDialog">×</button>
      </div>
      <div class="dialog-content">
        <p>{{ message }}</p>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    message: {
      type: String,
      default: ''
    }
  },
  emits: ['update:visible'],
  methods: {
    closeDialog() {
      this.$emit('update:visible', false);
    },
    handleOverlayClick() {
      this.closeDialog();
    }
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.dialog-container {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 420px;
  overflow: hidden;
  animation: dialogEnter 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  border: 1px solid #eef2f7;
}

@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dialog-header {
  padding: 20px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  color: #2A3535;
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.dialog-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.dialog-close:hover {
  background-color: #f0f0f0;
  color: #666;
}

.dialog-content {
  padding: 20px;
  color: #666;
  font-size: var(--font-size-base);
  line-height: 1.6;
}

.dialog-footer {
  padding: 15px 20px 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer .el-button {
  border-radius: 30px;
  padding: 10px 24px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(42, 53, 53, 0.1);
  transition: all 0.3s ease;
}

.dialog-footer .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(42, 53, 53, 0.15);
}
</style>
