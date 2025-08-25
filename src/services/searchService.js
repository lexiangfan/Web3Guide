// src/services/searchService.js
class SearchService {
    constructor() {
        this.searchIndex = []
    }

    // 初始化所有内容到搜索索引
    initializeAllContents(contents) {
        this.searchIndex = [...contents]
    }

    // 重置搜索索引
    resetIndex() {
        this.searchIndex = []
    }

    // 搜索功能
    search(query) {
        if (!query || query.trim() === '') {
            return []
        }

        const normalizedQuery = query.toLowerCase().trim()
        return this.searchIndex.filter(item => {
            return (
                (item.title && item.title.toLowerCase().includes(normalizedQuery)) ||
                (item.content && item.content.toLowerCase().includes(normalizedQuery))
            )
        }).map(item => ({
            ...item,
            // 高亮匹配的关键词
            highlightedTitle: this.highlightMatch(item.title, query),
            highlightedContent: this.getExcerpt(item.content, query)
        }))
    }

    // 高亮匹配的关键词
    highlightMatch(text, query) {
        if (!text || !query) return text
        const regex = new RegExp(`(${query})`, 'gi')
        return text.replace(regex, '<mark>$1</mark>')
    }

    // 获取内容摘要
    getExcerpt(content, query, length = 100) {
        if (!content) return ''

        const normalizedContent = content.toLowerCase()
        const normalizedQuery = query.toLowerCase()
        const queryIndex = normalizedContent.indexOf(normalizedQuery)

        if (queryIndex === -1) {
            // 如果没找到查询词，返回开头部分内容
            return content.length > length ? content.substring(0, length) + '...' : content
        }

        // 计算摘录的起始位置
        const start = Math.max(0, queryIndex - Math.floor(length / 2))
        const end = Math.min(content.length, start + length)
        let excerpt = content.substring(start, end)

        // 如果不是从开头截取，添加前缀
        if (start > 0) {
            excerpt = '...' + excerpt
        }

        // 如果不是到结尾截取，添加后缀
        if (end < content.length) {
            excerpt = excerpt + '...'
        }

        return excerpt
    }

    // 获取搜索索引
    getSearchIndex() {
        return this.searchIndex
    }
}

export default new SearchService()
