// services/contentLoader.js
class ContentLoader {
    async loadAllPageContents() {
        const pageContents = {};

        try {
            // 使用动态导入确保在构建时正确处理路径
            const modules = {
                '/page1': () => import('../utils/page1.js'),
                '/UserManualForOfflineMnemonicBackupTool': () => import('../utils/UserManualForOfflineMnemonicBackupTool.js'),
            };

            // 并行加载所有模块
            const loadPromises = Object.entries(modules).map(async ([path, loader]) => {
                try {
                    const module = await loader();
                    const content = module.default || module.pageContents || module.content;

                    if (content) {
                        const titles = {
                            '/': 'Web3 新手小白向导',
                            '/page1': '基础知识',
                            '/UserManualForOfflineMnemonicBackupTool': '助记词离线备份工具使用手册'
                        };

                        pageContents[path] = {
                            content: content,
                            title: titles[path] || '未知页面'
                        };
                    }
                } catch (error) {
                    console.warn(`Failed to load content for ${path}:`, error);
                }
            });

            await Promise.all(loadPromises);
        } catch (error) {
            console.warn('Failed to load page contents:', error);
        }

        return pageContents;
    }
}

export default new ContentLoader();
