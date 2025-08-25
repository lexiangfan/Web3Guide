// src/services/contentLoader.js
import { pageRegistry } from '@/services/pageRegistry.js'

class ContentLoader {
    constructor() {
        this.allContents = []
    }

    // 加载所有页面内容
    async loadAllPageContents() {
        // 重置内容数组
        this.allContents = []

        // 获取所有页面数据
        const allPageData = await pageRegistry.getAllPageData()

        // 处理每个页面的内容
        for (const [pageId, pageData] of Object.entries(allPageData)) {
            this.processPageContent(pageId, pageData)
        }

        return this.allContents
    }

    // 处理单个页面内容
    processPageContent(pageId, pageData) {
        // 处理页面的主标题和描述
        this.allContents.push({
            id: `${pageId}-main`,
            title: pageData.title || pageRegistry.getPageTitle(pageId) || '无标题',
            content: pageData.description || '',
            path: pageRegistry.getPagePath(pageId),
            type: 'page'
        })

        // 处理各个章节内容
        if (pageData.sections && Array.isArray(pageData.sections)) {
            pageData.sections.forEach((section, sectionIndex) => {
                // 处理章节标题
                this.allContents.push({
                    id: `${pageId}-section-${sectionIndex}`,
                    title: section.title || '无标题章节',
                    content: '',
                    path: pageRegistry.getPagePath(pageId),
                    type: 'section'
                })

                // 处理章节中的文件
                if (section.files && Array.isArray(section.files)) {
                    section.files.forEach((file, fileIndex) => {
                        this.allContents.push({
                            id: `${pageId}-section-${sectionIndex}-file-${fileIndex}`,
                            title: file.title || '无标题文件',
                            content: this.stripHtmlTags(file.content || ''),
                            path: `${pageRegistry.getPagePath(pageId)}#${file.id}`,
                            type: 'file',
                            lastUpdated: file.lastUpdated
                        })
                    })
                }
            })
        }
    }

    // 移除HTML标签，只保留纯文本内容
    stripHtmlTags(html) {
        if (!html) return ''
        const tmp = document.createElement('div')
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ''
    }

    // 获取所有内容（供搜索使用）
    getAllContents() {
        return this.allContents
    }
}

export default new ContentLoader()
