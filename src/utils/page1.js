// src/utils/page1.js
const pageContents = {
    sections: [
        {
            id: 'section1',
            title: '新手入门指南',
            files: [
                {
                    id: 'file1',
                    title: '什么是 Web3',
                    content: `
            <h2>Web3 简介</h2>
            <p>Web3 代表下一代互联网，它基于区块链技术，旨在创建一个去中心化的网络环境。</p>
            
            <h3>Web3 的核心特征</h3>
            <ul>
              <li><strong>去中心化</strong>：没有中央权威控制网络</li>
              <li><strong>用户拥有数据</strong>：用户控制自己的数字身份和数据</li>
              <li><strong>原生支付</strong>：内置支付功能，无需中介机构</li>
              <li><strong>无信任和无需许可</strong>：网络是开放的，任何人都可以参与</li>
            </ul>
            
            <h3>Web3 与传统网络的区别</h3>
            <p>传统的 Web2 由大型科技公司控制，而 Web3 则将权力归还给用户，通过区块链技术实现真正的去中心化。</p>
          `,
                    lastUpdated: '2023-10-01'
                },
                {
                    id: 'file2',
                    title: '钱包基础知识',
                    content: `
            <h2>什么是加密钱包</h2>
            <p>加密钱包是管理您的加密资产和数字身份的工具。它存储您的私钥，这些私钥是访问您的数字资产的密码。</p>
            
            <h3>钱包类型</h3>
            <ul>
              <li><strong>热钱包</strong>：连接到互联网的钱包，便于交易但安全性较低</li>
              <li><strong>冷钱包</strong>：离线存储的钱包，安全性高但使用不便</li>
            </ul>
            
            <h3>如何选择钱包</h3>
            <p>选择钱包时应考虑以下因素：</p>
            <ul>
              <li>安全性</li>
              <li>易用性</li>
              <li>支持的资产种类</li>
              <li>备份和恢复功能</li>
            </ul>
          `,
                    lastUpdated: '2023-10-02'
                }
            ]
        },
        {
            id: 'section2',
            title: '常见操作',
            files: [
                {
                    id: 'file3',
                    title: '如何发送加密货币',
                    content: `
            <h2>发送加密货币步骤</h2>
            <ol>
              <li>打开您的加密钱包应用</li>
              <li>选择要发送的加密货币类型</li>
              <li>点击"发送"按钮</li>
              <li>输入接收方的钱包地址</li>
              <li>输入发送金额</li>
              <li>确认交易详情</li>
              <li>使用您的私钥或密码签署交易</li>
              <li>等待网络确认交易</li>
            </ol>
            
            <h3>注意事项</h3>
            <ul>
              <li>仔细检查接收方地址，一旦发送无法撤回</li>
              <li>注意网络手续费</li>
              <li>确保钱包有足够的余额支付手续费</li>
            </ul>
          `,
                    lastUpdated: '2023-10-03'
                },
                {
                    id: 'file4',
                    title: '如何接收加密货币',
                    content: `
            <h2>接收加密货币步骤</h2>
            <ol>
              <li>打开您的加密钱包应用</li>
              <li>选择要接收的加密货币类型</li>
              <li>点击"接收"按钮</li>
              <li>复制您的钱包地址或生成二维码</li>
              <li>将地址或二维码提供给发送方</li>
              <li>等待资金到账</li>
            </ol>
            
            <h3>安全提示</h3>
            <ul>
              <li>确保提供正确的钱包地址</li>
              <li>只接收您信任的加密货币</li>
              <li>确认网络状态以避免延迟</li>
            </ul>
          `,
                    lastUpdated: '2023-10-04'
                }
            ]
        }
    ]
}

export default pageContents
