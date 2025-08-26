<!-- src/views/page1.vue -->
<template>
  <div class="page-container">
    <ContentPageTemplate :content-data="formattedContentData" />
  </div>
</template>

<script>
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import pageContents from '@/utils/UserManualForOfflineMnemonicBackupTool.js'

export default {
  name: 'UserManualForOfflineMnemonicBackupTool',
  components: {
    ContentPageTemplate
  },
  computed: {
    formattedContentData() {
      return {
        sections: pageContents
      };
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 0;
  min-height: calc(100vh - var(--navbar-height));
  background-color: #f5f7fa;
  box-sizing: border-box;
  width: 100%;
}
</style>
