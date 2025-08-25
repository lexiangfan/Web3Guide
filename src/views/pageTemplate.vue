<!-- src/views/pageTemplate.vue -->
<template>
  <div class="page-container">
    <ContentPageTemplate :content-data="pageContents" />
  </div>
</template>

<script>
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import pageContents from '@/utils/pageTemplate.js'

export default {
  name: 'PageTemplate',
  components: {
    ContentPageTemplate
  },
  setup() {
    return {
      pageContents
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
