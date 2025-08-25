// src/services/pageRegistry.js
// 页面注册表，便于统一管理和维护
export const pageRegistry = {
    pages: [
        {
            id: 'page1',
            path: '/page1',
            import: () => import('@/utils/page1.js'),
            title: '内容第二章'
        },
        {
            id: 'pageTemplate',
            path: '/page',
            import: () => import('@/utils/pageTemplate.js'),
            title: 'Web3 内容第一章'
        }
        // 添加新页面时只需在这里注册
    ],

    // 获取所有页面数据
    async getAllPageData() {
        const pageData = {}
        for (const page of this.pages) {
            try {
                const module = await page.import()
                pageData[page.id] = module.default || module
            } catch (error) {
                console.error(`Failed to load page data for ${page.id}:`, error)
            }
        }
        return pageData
    },

    // 获取页面路径
    getPagePath(pageId) {
        const page = this.pages.find(p => p.id === pageId)
        return page ? page.path : '/'
    },

    // 获取页面标题
    getPageTitle(pageId) {
        const page = this.pages.find(p => p.id === pageId)
        return page ? page.title : '未知页面'
    }
}
