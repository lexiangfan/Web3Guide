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
        const results = this.searchIndex.filter(item => {
            return (
                (item.title && item.title.toLowerCase().includes(normalizedQuery)) ||
                (item.content && item.content.toLowerCase().includes(normalizedQuery))
            )
        }).map(item => ({
            ...item
        }))

        // 按相关性排序 - 标题匹配优先
        results.sort((a, b) => {
            const aTitleMatch = a.title.toLowerCase().includes(normalizedQuery) ? 1 : 0
            const bTitleMatch = b.title.toLowerCase().includes(normalizedQuery) ? 1 : 0

            // 标题匹配优先
            if (aTitleMatch !== bTitleMatch) {
                return bTitleMatch - aTitleMatch
            }

            // 如果都是标题匹配或都不是，按内容匹配数排序
            const aContentMatches = (a.content.match(new RegExp(normalizedQuery, 'gi')) || []).length
            const bContentMatches = (b.content.match(new RegExp(normalizedQuery, 'gi')) || []).length

            // 内容匹配次数多的优先
            if (aContentMatches !== bContentMatches) {
                return bContentMatches - aContentMatches
            }

            // 最后按标题长度排序（标题短的更精确）
            return a.title.length - b.title.length
        })

        return results.slice(0, 20) // 限制结果数量
    }
}

export default new SearchService()
