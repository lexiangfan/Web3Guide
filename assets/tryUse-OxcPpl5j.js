const i="/Web3Guide/assets/use1-n5WhGhYV.png",s="/Web3Guide/assets/use2-BQV0qT7t.png",l="/Web3Guide/assets/use3-BHQEiP_V.png",p="/Web3Guide/assets/use4-DS7tZGYo.png",t="/Web3Guide/assets/use5-AjlWNL3E.png",a="/Web3Guide/assets/use6-lN4Fsh-o.png",o="/Web3Guide/assets/use7-CdM1gO19.png",e="/Web3Guide/assets/use8_1-D_wGvbVg.png",n="/Web3Guide/assets/use8_2-RuGzH6AW.png",T=[{id:"section1",title:"体验资产操作",content:"",children:[{id:"file1_1",title:"imKey Pro 如何转账？",content:`
<h2>imKey Pro 转账教程</h2>
                 <div class="video-container">
    <iframe 
        src="//player.bilibili.com/player.html?isOutside=true&aid=114492771933674&bvid=BV1YJELz8Eiy&cid=29917972337&p=1" 
        frameborder="0" 
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        loading="lazy"
        referrerpolicy="no-referrer"
        title="imKey 转账教程视频"
        class="responsive-iframe">
    </iframe>
</div>

<p>若你在 imKey 钱包内的资产想要转到交易所，转账之前需要先了解如何获取正确的交易所充值地址，以转账 USDT 为例：</p>
<ul>
<li>转账 ETH 钱包内的 USDT，需要复制交易所 ERC20 USDT 充值地址；</li>
<li>转账 BTC 钱包内的 USDT，需要复制交易所 OMNI USDT 充值地址；</li>
<li>转账 TRX 钱包内的 USDT，需要复制交易所 TRC20 USDT 充值地址。</li>
</ul>
<p>若你打开 ETH 钱包内的 USDT 转账界面，却输入了交易所 TRC20 USDT 充值地址，imToken 就会弹出「不正确的钱包地址」提示。</p>
<p> <strong> 温馨提醒：</strong>转账时需要使用特定币种支付手续费，因此请确保你的钱包内有充足的特定币种用于支付费用。</p>
<ul>
<li>转出 ERC20 USDT，推荐你的 ETH 钱包内至少有约 0.02 个 ETH；</li>
<li>转出 TRC20 USDT，推荐你的 TRX 钱包内至少有约 50 个 TRX；</li>
</ul>
<p> 说明：所有手续费都是由区块链网络收取，imKey 不从中收取任何费用。</p>
<p> 下面我们将以 imKey 的 ETH 钱包转 USDT 为例向你介绍如何使用 imKey 钱包进行转账，一起来看看吧～</p>
<h2>准备工作</h2>
<ul>
<li>打开 imKey 硬件钱包及手机蓝牙（安卓手机需要开启 GPS 定位服务）；</li>
<li>转账前请确保钱包内有充足的主网币以支付矿工费。</li>
</ul>

<h2>如何转账</h2>
<ol>
<li>
<p>打开 imToken，点击左上角图标，进入「选择账户」界面，再点击 imKey 硬件钱包的 ETH 钱包。</p>
<img src="${i}" alt="use1">
</li>
<li>
<p>点击「转账」选择 USDT，粘贴交易所的收款地址并输入转账金额，点击「下一步」。</p>
<span style="color: #999"> 注：收款地址需填写 ERC20 USDT 的充值地址。</span>
<img src="${s}" alt="use2">
</li>
<li>
<p>点击「请求 imKey 确认」，检查 imKey 硬件钱包上的「支付信息」并点击向下键进入下一页。</p>
<img src="${l}" alt="use3">
</li>
<li>
<p>确认「收款地址」及「矿工费用」后，点击「OK」键签名确认，等待一会儿你就能在收款地址中看到你转出的 USDT 了。 </p>
<span style="color: #999">注：在钱包首页的「记录」中可查看你发起的转账交易状态。</span>
</li>
</ol>
                `},{id:"file1_2",title:"如何将资产从 imToken 转至 imKey",content:`
                <p>当 imKey 硬件钱包和 imToken App 完成绑定后，若想将 imToken 钱包内的代币转至 imKey 硬件钱包进行更安全的管理，可通过转账实现。例如，想把 imToken TRX 账户中的 USDT 转入 imKey 的 TRX 账户，具体步骤如下：</p>
                <ol>
                <li>
                <p>打开 imToken，点击左上角的导航栏进入「选择账户」界面，再点击 imKey 硬件钱包的 TRX 账户。</p>
                <img src="${p}" alt="use4">
</li>
                <li>
                <p>点击「收款」复制地址。</p>
                <img src="${t}" alt="use5">
</li>
                <li>
                <p>返回到「选择账户」界面，选择你要转账的 imToken 钱包中的 TRX 账户。</p>
                <img src="${a}" alt="use6">
</li>
                <li>
                <p>点击「转账」并选择 USDT，粘贴刚刚复制的收款地址并输入转账金额，点击「下一步」并输入密码，等待一会儿就可以在 imKey 的 TRX 账户内看到你转入的代币了。</p>
                <span style="color: #999">注：在 TRX 账户转账 USDT 需要消耗能量和带宽。如果你发起转账的钱包内没有能量和带宽，可以向 imToken 钱包的 TRX 账户中转入 50～100 个 TRX，转账时会自动燃烧少量 TRX 以抵扣转账所需的带宽和能量。</span>
                <img src="${o}" alt="use7">
</li>
</ol>
                
                `},{id:"file1_3",title:"如何从 OKX 交易所提币至 imKey 钱包？",content:`
                <p>
                你在从交易所提币至 imKey 之前，需先了解
                <a href="#/" target="_blank"> imKey 支持哪些数字货币</a>。若你转入了 imKey 不支持的代币，会发生交易所显示提币成功，但钱包内资产不到账的问题。
</p>
<p>
你可以结合 imKey  本篇教程以及 <a href="https://www.okx.com/zh-hans/help/how-do-i-make-a-withdrawal-app" target="_blank"> 欧易交易所官方教程</a>进行提币。
</p>

<h3>如何提币到 imKey ？</h3>
<ol>
<li>
<p>打开欧易交易所，点击「资产」-「提币」-「提取数字货币」，选择需提现的代币「ETH」-「链上提币」。</p>
<span style="color: #999">注：这里以 ETH 为例</span>
<img src="${e}" alt="use8_1">
</li>
<li>
<p>在「链上提币」页面，选择「提币网络」。这里以 ETH-ERC20 为例：</p>
<span style="color: #999">注：在选择「提币网络」之前，请先确认 <a href="#/"> imKey 支持哪些数字货币</a>。</span>
<img src="${n}" alt="use8_2">
</li>
<li>
<p>获取正确的「钱包地址」</p>
<p>打开 imToken，点击左上角的按钮，下拉到「imKey 硬件钱包」的部分选择用于收款的账户。</p>
<p>例如：我想将 USDT 提至 imKey 钱包的 ETH 账户，则选择 ETH 账户并点击「收款」-「复制」即可复制该账户地址。</p>
<span style="color: #999"><p>注：</p><p>
<ul>
<li>  如果你想转入 BTC，请点击钱包左上角选择 BTC 账户进行收款；</li>
<li>  如果你想转入 USDT，可使用 ETH 或 TRX 账户进行收款，对应的交易所提币网络分别为 ERC20 和 TRC20。</li>
</ul>
</p></span>
<img src="${e}" alt="use8_1">
</li>
<li>
<p>打开欧易交易所，点击「资产」-「提币」-「提取数字货币」，选择需提现的代币「ETH」-「链上提币」。</p>
<span style="color: #999">注：这里以 ETH 为例</span>
<img src="${e}" alt="use8_1">
</li>
<li>
<p>打开欧易交易所，点击「资产」-「提币」-「提取数字货币」，选择需提现的代币「ETH」-「链上提币」。</p>
<span style="color: #999">注：这里以 ETH 为例</span>
<img src="${e}" alt="use8_1">
</li>
</ol>

                `}]}];export{T as default};
