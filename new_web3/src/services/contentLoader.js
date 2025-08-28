class ContentLoader {
    constructor() {
        this.allContents = []
    }

    async loadAllPageContents() {
        this.allContents = []
        
        try {
            const allPageData = await pageRegistry.getAllPageData()
            
            for (const [pageId, pageData] of Object.entries(allPageData)) {
                this.processPageContent(pageId, pageData)
            }
            
            return this.allContents
        } catch (error) {
            console.error('加载页面内容失败:', error)
            return []
        }
    }

    processPageContent(pageId, pageData) {
        try {
            // 添加页面主标题
            this.allContents.push({
                id: `${pageId}-main`,
                title: pageData.title || pageRegistry.getPageTitle(pageId) || '无标题',
                content: this.stripHtmlTags(pageData.content || ''), // 添加 content 字段
                path: pageRegistry.getPagePath(pageId),
                fullPath: [pageData.title],
                type: 'page'
            })

            // 处理章节内容
            if (pageData.sections && Array.isArray(pageData.sections)) {
                this.processSections(pageId, pageData.sections, pageRegistry.getPagePath(pageId), [pageData.title])
            }
        } catch (error) {
            console.error(`处理页面内容失败 ${pageId}:`, error)
        }
    }

    // 递归处理章节内容
    processSections(pageId, sections, basePath, pathStack = []) {
        sections.forEach((section, sectionIndex) => {
            const currentPath = [...pathStack, section.title]
            
            // 添加章节标题
            this.allContents.push({
                id: `${pageId}-section-${sectionIndex}`,
                title: section.title || '无标题章节',
                content: this.stripHtmlTags(section.content || ''), // 提取章节内容
                path: basePath,
                fullPath: currentPath,
                type: 'section'
            })
            
            // 处理章节中的文件
            if (section.children && Array.isArray(section.children)) {
                section.children.forEach((child, childIndex) => {
                    this.allContents.push({
                        id: child.id || `${pageId}-section-${sectionIndex}-child-${childIndex}`,
                        title: child.title || '无标题文件',
                        content: this.stripHtmlTags(child.content || ''), // 提取文件内容
                        path: `${basePath}#${child.id}`,
                        fullPath: [...currentPath, child.title],
                        type: 'file',
                        lastUpdated: child.lastUpdated
                    })
                })
            }
            
            // 递归处理嵌套章节
            if (section.sections && Array.isArray(section.sections)) {
                this.processSections(
                    pageId, 
                    section.sections, 
                    basePath, 
                    currentPath
                )
            }
        })
    }

    stripHtmlTags(html) {
        if (!html) return ''
        const tmp = document.createElement('div')
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ''
    }
}

export default new ContentLoader()