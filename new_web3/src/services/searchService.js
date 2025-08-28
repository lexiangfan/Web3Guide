class SearchService {
    constructor() {
        this.searchIndex = []
    }

    initializeAllContents(contents) {
        this.searchIndex = [...contents]
    }

    resetIndex() {
        this.searchIndex = []
    }

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
            ...item,
            path: item.path || item.pagePath || '/',
            score: 0
        }))
        
        // 评分算法
        results.forEach(item => {
            let score = 0
            
            // 标题匹配加分
            if (item.title && item.title.toLowerCase().includes(normalizedQuery)) {
                score += 100
            }
            
            // 路径匹配加分
            if (item.fullPath && Array.isArray(item.fullPath)) {
                item.fullPath.forEach((pathItem, index) => {
                    if (pathItem && pathItem.toLowerCase().includes(normalizedQuery)) {
                        score += Math.max(0, 50 - index * 10)
                    }
                })
            }
            
            // 内容匹配次数
            const contentMatches = (item.content.match(new RegExp(normalizedQuery, 'gi')) || []).length
            score += contentMatches * 10
            
            // 路径深度奖励
            if (item.fullPath && item.fullPath.length > 2) {
                score += 20
            }
            
            item.score = score
        })
        
        // 按评分排序
        return results
            .filter(item => item.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score
                }
                return a.title.length - b.title.length
            })
            .slice(0, 20)
    }

    getPageTitle(path) {
        const pageTitles = {
            '/': 'Web3 入门',
            '/page1': '基础知识',
            '/UserManualForOfflineMnemonicBackupTool': '助记词离线备份工具使用手册'
        }
        return pageTitles[path] || '未知页面'
    }
}

export default new SearchService()