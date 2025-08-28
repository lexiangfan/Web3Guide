<template>
  <div :class="['home-container', $attrs.class || '']">
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-text">Web3 新手小白的安全向导</span>
        </div>
        <h1 class="hero-title">
          <span class="title-line">
            开启你的imKey之旅
          </span>
          <span class="title-line gradient-text">
            <br> 极致安全 | 简单易用 | 多链支持 | 长期可靠
          </span>
        </h1>
        <div class="hero-actions">
          <el-button
              type="primary"
              size="large"
              @click="startLearning"
              class="primary-button"
          >
            观看开箱视频
            <el-icon class="button-icon">
              <ArrowRight/>
            </el-icon>
          </el-button>
          <el-button
              size="large"
              class="secondary-button"
              @click="goToImKey"
          >
            访问 imKey 官网<el-icon><TopRight /></el-icon>
          </el-button>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="section-header">
        <h2>“一步步开箱，安全不会出错”</h2>
      </div>

      <section class="progress-section-wrapper">
        <div class="progress-section">
          <div class="progress-bar">
            <div
                v-for="(step, index) in progressSteps"
                :key="index"
                class="step"
                :class="step.status"
            >
              {{ step.title }}
            </div>
          </div>
        </div>
      </section>

      <div class="features-grid">
        <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
            :class="{
          'active': feature.showTip,
          'completed': index < progressSteps.findIndex(step => step.status === 'active') ||
                      progressSteps.findIndex(step => step.status === 'active') === -1
        }"
            @click="toggleTip(index)"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
        >

          <h3 class="feature-title" v-html="feature.title"></h3>
          <p class="feature-description" v-html="feature.description"></p>

          <div v-if="feature.showTip" class="feature-tip">
            <div class="tip-content" v-html="feature.tip"></div>
          </div>
          <div class="feature-content-wrapper">
            <div class="feature-bottom-content">
              <a
                  v-if="feature.link"
                  :href="extractHref(feature.link)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="feature-link"
                  @click.stop
                  v-html="extractLinkText(feature.link)"
              ></a>
              <div v-if="feature.image" class="feature-image-container">
                <img
                    :src="getStepImage(index)"
                    :alt="`Step ${index + 1}: ${feature.title}`"
                    class="feature-image-aligned">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="must-see-full-width">
      <img :src="must_s" alt="新手必读" class="must-see-banner">
    </div>

    <div class="checklist-section">
      <!-- 新手必看：自我检查 -->
      <div class="info-card checklist-container no-padding">
        <div class="info-image-wrapper">
          <div class="info-image" :style="{ backgroundImage: `url(${greenHand})` }">
            <h3 class="info-title large-title">新手必看，自我检查</h3>
          </div>
        </div>

        <div class="info-content">
          <ul class="info-list checklist-list">
            <li v-for="(item, index) in checklistItems" :key="index" class="checklist-item">
              <div class="checklist-content-wrapper">
                <label class="checkbox-label">
                  <input
                      type="checkbox"
                      v-model="item.checked"
                      @change="saveProgress"
                  />
                  <span class="checkmark"></span>
                  <span class="check-text">{{ item.text }}</span>
                </label>
                <img
                    v-if="item.hasIcon"
                    :src="imKeyCom"
                    alt="imKey"
                    class="item-icon"
                />
              </div>
            </li>
          </ul>

          <!-- 进度显示 -->
          <div class="progress-summary">
            <div class="progress-bar-container">
              <div
                  class="progress-fill"
                  :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <!-- 添加安全提示 -->
            <div  v-if="completedCount > 0" class="safety-tip" :class="safetyTipClass">
              {{ safetyTipText }}
            </div>
            <div class="progress-text">
              完成进度: {{ completedCount }}/{{ checklistItems.length }} ({{ progressPercentage }}%)
            </div>
          </div>
        </div>
      </div>

      <!-- 常见问题 (桌面端显示) -->
      <div class="info-card faq-container no-padding">
        <!-- 左侧内容 -->
        <div class="info-content">
          <div class="faq-list">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
              <div class="faq-question" @click="toggleFaq(index)">
                <span class="faq-text">{{ faq.question }}</span>
                <el-icon class="faq-icon" :class="{ 'rotated': faq.expanded }">
                  <ArrowDownBold />
                </el-icon>
              </div>
              <transition name="slide-fade">
                <div v-show="faq.expanded" class="faq-answer" v-html="faq.answer"></div>
              </transition>
            </div>
          </div>
        </div>

        <!-- 右侧图像区域 -->
        <div class="info-image-wrapper">
          <div class="info-image" :style="{ backgroundImage: `url(${question})` }">
            <h3 class="info-title large-title">常见问题，一看就懂</h3>
          </div>
        </div>
      </div>

      <!-- 常见问题 (移动端显示) -->
      <div class="info-card model-faq-container no-padding">
        <!-- 上方图像区域 -->
        <div class="info-image-wrapper">
          <div class="info-image mobile-header" :style="{ backgroundImage: `url(${question})` }">
            <h3 class="info-title large-title">常见问题，一看就懂</h3>
          </div>
        </div>

        <!-- 下方内容区域 -->
        <div class="info-content">
          <div class="faq-list">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
              <div class="faq-question" @click="toggleFaq(index)">
                <span class="faq-text">{{ faq.question }}</span>
                <el-icon class="faq-icon" :class="{ 'rotated': faq.expanded }">
                  <ArrowDownBold />
                </el-icon>
              </div>
              <transition name="slide-fade">
                <div v-show="faq.expanded" class="faq-answer" v-html="faq.answer"></div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="more-section-container">
      <section class="more-section">
        <div class="more-content" :style="{ backgroundImage: `url(${more})` }">
          <span class="large-text">不止imToken，连接Rabby，解锁更多 Web3 体验</span>
        </div>
      </section>
    </div>
  </div>

  <div class="contact-section">
    <p class="contact-title">
      若有任何疑问或需要帮助，<br>
      请联系我们官方客服，我们将竭诚为你服务
    </p>

    <div class="contact-links">
      <a href="https://imkey.im" target="_blank" rel="noopener noreferrer" class="contact-link">
        <span class="icon-wrapper">
          <img :src="imKey_logo" alt="imKey_logo" class="contact-icon">
        </span>
        <span class="text">https://imkey.im</span>
      </a>

      <a href="https://support.imkey.im" target="_blank" rel="noopener noreferrer" class="contact-link">
        <span class="icon-wrapper">
          <img :src="imKey_logo2" alt="imKey_logo2" class="contact-icon">
        </span>
        <span class="text">support.imkey.im</span>
      </a>

      <a href="mailto:support@imkey.im" class="contact-link">
        <span class="icon-wrapper">
          <img :src="imKey_logo3" alt="imKey_logo3" class="contact-icon">
        </span>
        <span class="text">support@imkey.im</span>
      </a>

      <a href="https://x.com/imKeyOfficial" target="_blank" rel="noopener noreferrer" class="contact-link">
        <span class="icon-wrapper">
          <img :src="imKey_logo4" alt="imKey_logo4" class="contact-icon">
        </span>
        <span class="text">@imKeyOfficial</span>
      </a>
    </div>
  </div>

  <CustomDialog
      v-model:visible="dialogVisible"
      title="提示"
      :message="dialogMessage"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import router from "@/router/router.js"
import {ArrowDownBold, ArrowRight, TopRight} from '@element-plus/icons-vue'
import step1 from'@/public/images/step1.svg'
import step2 from'@/public/images/step2.svg'
import step3 from'@/public/images/step3.svg'
import step4 from'@/public/images/step4.svg'
import step5 from'@/public/images/step5.svg'
import greenHand from'@/public/images/greenHand.png'
import imKeyCom from'@/public/images/imKeyCom.png'
import must from'@/public/images/must.png'
import must_s from'@/public/images/must.svg'
import question from'@/public/images/question.png'
import more from'@/public/images/more.png'
import CustomDialog from "@/components/CustomDialog.vue"
import imKey_logo from "@/public/images/logo/imKey_logo1.png"
import imKey_logo2 from "@/public/images/logo/imKey_logo2.png"
import imKey_logo3 from "@/public/images/logo/imKey_logo3.png"
import imKey_logo4 from "@/public/images/logo/imKey_logo4.png"
import imKeyProductImage from "@/public/images/more.png"

const stepImages = [step1, step2, step3, step4, step5]

// 提取链接的href属性
const extractHref = (linkHtml) => {
  const match = linkHtml.match(/href="([^"]*)"/)
  return match ? match[1] : '#'
}

// 提取链接文本
const extractLinkText = (linkHtml) => {
  const match = linkHtml.match(/>([^<]*)</)
  return match ? match[1] : '点击了解更多'
}

const features = ref([
  {
    icon: '',
    title: 'Step 1 :开箱与设备检查',
    description: `
    <ul>
    <li>拆开包装，检查设备外观与配件是否完整</li>
    <li>输入设备 SN码，验证设备状态，判别真伪</li>
</ul>
    `,
    tip: `
    小贴士：
    <ul>
    <li>请确认钱包购自<strong>官方渠道</strong>，避免使用来源不明的设备</li>
</ul>
    `,
    showTip: false,
    link: `<a href="https://imkey.im" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
    image: true
  },
  {
    icon: '',
    title: 'Step 2 :准备好工具',
    description: `
    <ul>
    <li>从 官方渠道 下载并安装imToken App</li>
    <li>在App中创建一个热钱包(后续会与硬件钱包配合使用)</li>
</ul>
    `,
    tip: `
    小贴士：
    <ul>
    <li>请确认下载自<strong>官方渠道</strong>，避免假冒App</li>
</ul>
    `,
    showTip: false,
    link: `<a href="https://imkey.im" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
    image: true
  },
  {
    icon: '',
    title: 'Step 3 :<br>' +
        '连接并激活 imKey',
    description: `
    <ul>
    <li>打开imToken App,搜索并匹配对你的imKey</li>
    <li>按提示完成绑定与激活(初始化设置)</li>
</ul>
    `,
    tip: `
    小贴士：
    <ul>
    <li>设置一个<strong>高强度 PIN 码</strong></li>
    <li>妥善保存 PIN 和绑定码</li>
</ul>
    `,
    showTip: false,
    link: `<a href="https://imkey.im" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
    image: true
  },
  {
    icon: '',
    title: 'Step 4 :<br>' +
        '创建并备份 imKey钱包',
    description: `
    <ul>
    <li>按照设备提示,创建一个全新的 imKey 冷钱包</li>
    <li>按需添加账户</li>
</ul>
    `,
    tip: `
    小贴士：
    <ul>
    <li><strong>不要混淆：</strong>imToken热钱包与imKey冷钱包是两套不同的助记词</li>
    <li>建议使用<strong>助记词密盒</strong>或纸质方式<strong>离线备份</strong>，不要拍照或上传云端</li>
</ul>
    `,
    showTip: false,
    link: `<a href="https://imkey.im" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
    image: true
  },
  {
    icon: '',
    title: 'Step 5 :<br>' +
        '体验资产操作',
    description: `
    使用imKey + imToken搭配完成:
    <ul>
    <li>代币收款与转账</li>
    <li>代币兑换(Swap)</li>
    <li>Dapp 中的 交易签名</li>
</ul>
    `,
    tip: `
    小贴士：
    <ul>
    <li>先尝试小额转账，确认操作熟悉再进行大额资产操作</li>
    <li>每次签名前，请仔细核对<strong>交易信息与地址</strong>，避免误操作<strong>离线备份</strong>，不要拍照或上传云端</li>
</ul>
    `,
    showTip: false,
    link: `<a href="https://imkey.im" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
    image: true
  }
])

// 根据索引获取对应步骤的图片
const getStepImage = (index) => {
  return stepImages[index] || step1 // 默认返回第一张图片
}

// 进度条状态
const progressSteps = ref([
  {title: '开箱', status: 'active'},
  {title: '准备', status: ''},
  {title: '激活', status: ''},
  {title: '创建&备份', status: ''},
  {title: '体验', status: ''}
])

const dialogVisible = ref(false)
const dialogMessage = ref('')

const toggleTip = (index) => {
  // 获取当前激活步骤的索引
  const activeIndex = progressSteps.value.findIndex(step => step.status === 'active');
  const isAllCompleted = activeIndex === -1; // 所有步骤已完成

  // 判断点击是否有效
  let isValidClick = false;

  if (isAllCompleted) {
    // 如果所有步骤已完成，允许点击任何卡片
    isValidClick = true;
  } else if (features.value[index].showTip) {
    // 如果点击的是已展开的卡片，允许关闭
    isValidClick = true;
  } else if (index === activeIndex) {
    // 如果点击的是当前步骤，允许展开
    isValidClick = true;
  } else if (index < activeIndex) {
    // 如果点击的是已完成的步骤，允许查看（但不更新进度）
    isValidClick = true;
  }

  // 如果点击无效，提示用户
  if (!isValidClick) {
    dialogMessage.value = '请按步骤进行操作';
    dialogVisible.value = true;
    return;
  }

  // 关闭其他卡片的提示（除了当前点击的）
  features.value.forEach((feature, i) => {
    if (i !== index) {
      feature.showTip = false;
    }
  });

  // 切换当前卡片的提示显示状态
  const willBeExpanded = !features.value[index].showTip;
  features.value[index].showTip = willBeExpanded;

  // 只有当展开当前步骤时才更新进度条
  if (willBeExpanded && index === activeIndex) {
    updateProgressAndMoveToNext(index);
  }

  // 保存状态到 sessionStorage
  saveFeaturesState();
}

// 更新进度条并移动到下一步
const updateProgressAndMoveToNext = (currentIndex) => {
  // 将当前步骤标记为已完成
  progressSteps.value[currentIndex].status = 'completed';

  // 如果有下一步，则将其标记为当前步骤
  if (currentIndex + 1 < progressSteps.value.length) {
    progressSteps.value[currentIndex + 1].status = 'active';
  }

  // 重置后续步骤状态（确保它们不是active状态）
  for (let i = currentIndex + 2; i < progressSteps.value.length; i++) {
    progressSteps.value[i].status = '';
  }

  // 保存状态到 sessionStorage
  saveProgressStepsState();
}

const startLearning = () => {
  router.push('/page')
}

const goToImKey = () => {
  window.open('https://imkey.im', '_blank')
}

// 新手必看检查清单相关
const checklistItems = ref([
  {
    text: "官方渠道下载 imToken App",
    checked: false,
    hasIcon: true
  },
  {
    text: "官方渠道购买 imKey 硬件钱包",
    checked: false,
    hasIcon: false
  },
  {
    text: "官网验证，imKey 硬件钱包处于「未激活」状态",
    checked: false,
    hasIcon: false
  },
  {
    text: "「创建钱包」，而非其他钱包的助记词导入「恢复钱包」",
    checked: false,
    hasIcon: false
  },
  {
    text: "创建钱包过程中，离线备份助记词，采用密盒 S1 保管",
    checked: false,
    hasIcon: false
  },
  {
    text: "自定义高强度 PIN 码，妥善备份绑定码",
    checked: false,
    hasIcon: false
  },
  {
    text: "仔细阅读，并收藏《区块链黑森林自救手册》",
    checked: false,
    hasIcon: false
  }
])

// 计算完成项目数量
const completedCount = computed(() => {
  return checklistItems.value.filter(item => item.checked).length
})

// 计算完成百分比
const progressPercentage = computed(() => {
  return Math.round((completedCount.value / checklistItems.value.length) * 100)
})

// 计算安全提示文本
const safetyTipText = computed(() => {
  if (completedCount.value < 3) {
    return "您的imKey 不够安全";
  } else if (completedCount.value >= 3 && completedCount.value < 7) {
    return "您的imKey比较安全";
  } else if (completedCount.value === 7) {
    return "您的imKey很安全";
  }
  return "";
});

// 计算安全提示类名
const safetyTipClass = computed(() => {
  if (completedCount.value < 3) {
    return "safety-tip-danger";
  } else if (completedCount.value >= 3 && completedCount.value < 7) {
    return "safety-tip-warning";
  } else if (completedCount.value === 7) {
    return "safety-tip-success";
  }
  return "";
});

// 保存进度到 sessionStorage
const saveProgress = () => {
  sessionStorage.setItem('checklistProgress', JSON.stringify(checklistItems.value))
}

// 从 sessionStorage 加载进度
const loadProgress = () => {
  const saved = sessionStorage.getItem('checklistProgress')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      checklistItems.value = parsed
    } catch (e) {
      console.warn('Failed to load checklist progress:', e)
    }
  }
}

// 保存 features 状态到 sessionStorage
const saveFeaturesState = () => {
  sessionStorage.setItem('homeFeaturesState', JSON.stringify(features.value.map(f => f.showTip)));
}

// 保存 progressSteps 状态到 sessionStorage
const saveProgressStepsState = () => {
  sessionStorage.setItem('homeProgressStepsState', JSON.stringify(progressSteps.value));
}

// 从 sessionStorage 加载状态
const loadSessionState = () => {
  // 加载 features 状态
  const savedFeaturesState = sessionStorage.getItem('homeFeaturesState');
  if (savedFeaturesState) {
    try {
      const parsed = JSON.parse(savedFeaturesState);
      features.value.forEach((feature, index) => {
        if (index < parsed.length) {
          feature.showTip = parsed[index];
        }
      });
    } catch (e) {
      console.warn('Failed to load features state:', e);
    }
  }

  // 加载 progressSteps 状态
  const savedProgressStepsState = sessionStorage.getItem('homeProgressStepsState');
  if (savedProgressStepsState) {
    try {
      const parsed = JSON.parse(savedProgressStepsState);
      progressSteps.value = parsed;
    } catch (e) {
      console.warn('Failed to load progress steps state:', e);
    }
  }
}

// 常见问题数据
const faqs = ref([
  {
    question: "Q1: 什么是数字钱包？它真的像银行账户一样吗？",
    answer: "A：数字钱包更像一个钥匙串或身份凭证管理器，而不是传统意义上银行账户。它本身不直接存放你的加密货币，而是存储一组用于访问和管理你在区块链上资产的钥匙（专业术语叫私钥）。你的币始终存在于区块链上，钱包只是提供一个让你能够访问和控制代币的操作接口。",
    expanded: false
  },
  {
    question: "Q2: 什么是助记词？为什么要妥善保存？",
    answer: `
<p>A: 助记词是一组由 <strong> 12、18 或 24 个英文单词 </strong>组成的随机词组，是你钱包的主钥匙，等同于资产的所有权。手机丢失或 App 删除时，只要有助记词，就能恢复钱包。但助记词也是最敏感的信息——一旦泄露，就可能导致资产瞬间被盗，且无法追回。</p>
<p>因此，妥善保存助记词是保护资产安全的第一道也是最后一道防线。切记 <strong> 不要拍照、不要上传云端、不要交给任何第三方</strong>。最安全的方式是离线保存，例如使用 <strong> 助记词密盒 </strong>或其他物理方式进行长期备份。 <strong>，是私钥的一种人类可读的备份形式。</strong> </p>
`,
    expanded: false
  },
  {
    question: "Q3: 热钱包和冷钱包有什么区别？",
    answer: `
<p>A: </p>
<ul>
<li>热钱包： 指私钥联网的钱包（如手机软件钱包、浏览器插件钱包、中心化交易所钱包）。使用方便，适合小额、高频交易或与 DApp 交互。</li>
<li>冷钱包： 指私钥完全离线、不联网的钱包（如硬件钱包）。安全性最高，适合存储大额或长期不动的资产。</li>
</ul>
`,
    expanded: false
  },
  {
    question: "Q4: 我为什么需要硬件钱包？",
    answer: "A: 硬件钱包能让私钥始终离线保存，避免病毒和远程攻击。它就像「保险箱」，是保护核心资产最安全的方式。",
    expanded: false
  },
  {
    question: "Q5: 如果我丢失了硬件钱包，资产会不会没了？",
    answer: "A: 不会。只要助记词安全保存，你可以在新的设备里恢复钱包。真正的风险是助记词泄露，而不是设备丢失。",
    expanded: false
  },
  {
    question: "Q6: 蓝牙/USB 连接会不会泄露私钥？",
    answer: "A:不会。硬件钱包只签名交易，私钥始终存储在安全芯片里，不会通过蓝牙/USB 传输。",
    expanded: false
  }
])

// 切换FAQ展开状态
const toggleFaq = (index) => {
  faqs.value[index].expanded = !faqs.value[index].expanded
}

onMounted(() => {
  loadProgress()
  loadSessionState() // 加载会话状态
})

onUnmounted(() => {
  // 移除滚动事件监听器
})
</script>

<style scoped>
.feature-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
  flex: 1;
}

.feature-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-top: auto;
  width: 100%;
}

.feature-link {
  color: #409eff;
  text-decoration: none;
  font-size: 16px;
  white-space: nowrap;
}

.feature-link:hover {
  text-decoration: underline;
}

.feature-image-container {
  display: flex;
  justify-content: flex-end;
}

.feature-image-aligned {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 其他样式保持不变 */
.home-container {
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  padding: var(--navbar-height) 0 0;
}

.hero-section {
  display: flex;
  align-items: center;
  background-image: url('@/public/images/more.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  position: relative;
  overflow: hidden;
  height: 42vh;
}

/* 移除了原来的渐变背景相关的伪元素 */
.hero-section::before,
.hero-section::after {
  display: none;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  position: relative;
  z-index: 1;
  margin-left: 6%;
  background-color: transparent;
  padding: 30px;
  border-radius: 16px;
}

.hero-badge {
  margin-bottom: 15px;
}

.badge-text {
  font-size: var(--font-size-xs);
  display: inline-block;
  background: linear-gradient(135deg, #BA955C 0%, #d4b68c 100%);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(186, 149, 92, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.badge-text::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.badge-text:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(186, 149, 92, 0.4);
  animation: none;
}

.badge-text:hover::before {
  left: 100%;
}

/* 添加脉冲发光效果的关键帧动画 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(186, 149, 92, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(186, 149, 92, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(186, 149, 92, 0);
  }
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  margin: 15px 0 20px;
  line-height: 1.2;
  color: #2A3535;
}

.gradient-text {
  font-size: var(--font-size-base);
  background: linear-gradient(90deg, #BA955C 0%, #2A3535 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.5;
}

@media (max-width: 992px) {
  .gradient-text {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .gradient-text {
    font-size: 14px;
  }

  .hero-content {
    margin: 0 20px;
    padding: 20px;
  }
}

.hero-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.primary-button {
  background-color: #2A3535 !important;
  border-color: #2A3535 !important;
  border-radius: 30px;
  padding: 12px 24px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 160px;
}

.primary-button:hover {
  background-color: #1a2222 !important;
  border-color: #1a2222 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 53, 53, 0.2);
}

.secondary-button {
  border-radius: 30px;
  padding: 12px 24px;
  border: 2px solid #e0e0e0 !important;
  color: #ffffff !important;
  font-size: var(--font-size-sm);
  font-weight: 500;
  background: transparent !important;
  transition: all 0.3s ease;
  min-width: 160px;
}

.secondary-button:hover {
  border-color: #2A3535 !important;
  color: #2A3535 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.visual-container {
  position: relative;
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Features Section */
.features-section {
  padding: 60px 0 40px;
  margin: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.section-header h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: 15px;
  color: #2A3535;
  font-weight: 800;
}

.section-header p {
  font-size: var(--font-size-base);
  color: #666666;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: auto;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.feature-card:nth-child(1) {
  grid-column: 1 / 4; /* 占据第1-3列 */
  grid-row: 1;
}

.feature-card:nth-child(2) {
  grid-column: 4 / 7; /* 占据第4-6列 */
  grid-row: 1;
}

.feature-card:nth-child(3) {
  grid-column: 1 / 3; /* 占据第1-2列 */
  grid-row: 2;
}

.feature-card:nth-child(4) {
  grid-column: 3 / 5; /* 占据第3-4列 */
  grid-row: 2;
}

.feature-card:nth-child(5) {
  grid-column: 5 / 7; /* 占据第5-6列 */
  grid-row: 2;
}

@media (max-width: 992px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  /* 在中等屏幕上，前两个卡片在第一行，后三个在第二行 */
  .feature-card:nth-child(1) {
    grid-column: 1;
    grid-row: 1;
  }

  .feature-card:nth-child(2) {
    grid-column: 2;
    grid-row: 1;
  }

  .feature-card:nth-child(3) {
    grid-column: 1;
    grid-row: 2;
  }

  .feature-card:nth-child(4) {
    grid-column: 2;
    grid-row: 2;
  }

  .feature-card:nth-child(5) {
    grid-column: 1 / 3; /* 跨越两列 */
    grid-row: 3;
  }
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 0 15px;
  }

  .feature-card {
    grid-column: 1 !important;
    grid-row: auto !important;
  }
}

.feature-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 16px;
  padding: 30px 25px;
  text-align: left !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transform: translateY(0);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(186, 149, 92, 0.2);
  border-color: rgba(186, 149, 92, 0.3);
}

.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #BA955C 0%, #2A3535 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card.active {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(186, 149, 92, 0.25);
  border-color: rgba(186, 149, 92, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%); /* 移除了原来的背景色 */
}

.feature-card.active::before {
  transform: scaleX(1);
  height: 6px;
}

.feature-title {
  font-size: var(--font-size-xl);
  margin-bottom: 15px;
  color: #2A3535;
  font-weight: 700;
  text-align: left;
}

.feature-description {
  font-size: var(--font-size-sm);
  color: #666666;
  line-height: 1.7;
  text-align: left;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 50px 0 30px;
  }

  .hero-content {
    margin-bottom: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-actions {
    justify-content: center;
  }

  .visual-container {
    width: 300px;
    height: 300px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }

  .hero-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .hero-section {
    padding-top: calc(var(--navbar-height) + 20px);
  }

  .primary-button,
  .secondary-button {
    width: 100% !important;
    max-width: 300px !important;
    justify-content: center !important;
    text-align: center !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .section-header h2 {
    font-size: 24px;
  }

  .section-header p {
    font-size: 16px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    padding: 0 15px;
  }

  /* 移动端保持原始大小 */
  .visual-container {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 480px) {
  .primary-button,
  .secondary-button {
    padding: 10px 20px !important;
    font-size: 14px !important;
    max-width: 100% !important;
  }

  .hero-actions {
    padding: 0 15px;
  }
}

/* 美化后的进度条样式 - 固定在导航栏下方 */
.progress-section-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  transition: height 0.3s ease;
  box-sizing: border-box;
}

.progress-section {
  padding: 0;
  width: 100%;
  background: transparent;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  top: 0;
  box-sizing: border-box;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  position: relative;
  max-width: 1200px;
  margin: 15px auto;
  box-sizing: border-box;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #e0e0e0, #BA955C, #2A3535);
  border-radius: 3px;
  transform: translateY(-50%);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(186, 149, 92, 0.3);
  transition: all 0.3s ease;
}

/* 活跃状态的连接线动画 */
.progress-bar.animated::before {
  background: linear-gradient(90deg, #e0e0e0, #BA955C, #2A3535, #BA955C);
  background-size: 200% 100%;
  animation: progressGradient 2s linear infinite;
}

@keyframes progressGradient {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

.progress-bar .step {
  position: relative;
  z-index: 2;
  width: clamp(35px, 7vw, 50px);
  height: clamp(35px, 7vw, 50px);
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(10px, 1.5vw, 14px);
  color: #666;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  cursor: pointer;
  text-align: center;
  line-height: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #ffffff;
  font-weight: 400;
  transform: scale(1);
  box-sizing: border-box;
}

.progress-bar .step.active {
  background: linear-gradient(135deg, #BA955C 0%, #d4b68c 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(186, 149, 92, 0.5);
  animation: pulse 2s infinite;
  border-color: #ffffff;
  z-index: 3;
  font-weight: 500;
}

.progress-bar .step.completed {
  background: linear-gradient(135deg, #2A3535 0%, #4a5555 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(42, 53, 53, 0.4);
  border-color: #ffffff;
  font-weight: 500;
}

.progress-bar .step:hover:not(.active):not(.completed) {
  transform: scale(1.05);
  background: linear-gradient(135deg, #d4b68c 0%, #BA955C 100%);
  color: white;
  font-weight: 500;
}

/* 步骤间的连接线状态 */
.progress-bar .step.completed:not(:first-child)::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -50%;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #2A3535, #2A3535);
  transform: translateY(-50%);
  z-index: -1;
  border-radius: 3px;
}

.progress-bar .step.active:not(:first-child)::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -50%;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #BA955C, #2A3535);
  transform: translateY(-50%);
  z-index: -1;
  border-radius: 3px;
}

@media (max-width: 768px) {
  .progress-bar {
    margin: 12px 0;
    padding: 10px 15px;
  }

  .progress-bar::before {
    height: 5px;
  }

  .progress-bar .step {
    width: 40px;
    height: 40px;
    font-size: clamp(10px, 1.8vw, 14px);
    font-weight: 400;
  }
}

@media (max-width: 480px) {
  .progress-bar {
    margin: 10px 0;
    padding: 8px;
  }

  .progress-bar::before {
    height: 4px;
  }

  .progress-bar .step {
    width: 30px !important;
    height: 30px !important;
    font-size: 10px !important;
    font-weight: 400;
  }

  .hero-title {
    font-size: 24px !important;
  }

  .feature-title {
    font-size: 18px !important;
  }
}

/* 移除了闪动边框效果 */
.feature-card:not(.active)::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #BA955C 0%, #2A3535 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-card:hover::after,
.feature-card.active::after {
  transform: scaleX(1);
}

/* 添加提示信息样式 */
.feature-tip {
  margin-top: 15px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.1), rgba(42, 53, 53, 0.1));
  border-radius: 12px;
  text-align: left;
  animation: tipFadeIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  border-left: 4px solid #BA955C;
  backdrop-filter: blur(5px);
  box-sizing: border-box;
}

@keyframes tipFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tip-content {
  font-size: var(--font-size-xs);
  color: #2A3535;
}

.tip-content ul {
  padding-left: 20px;
  margin: 10px 0;
}

.tip-content li {
  margin-bottom: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .feature-card {
    padding: 20px 15px !important;
  }

  .feature-tip {
    padding: 12px;
  }

  .tip-content {
    font-size: 12px;
  }
}

.feature-card.completed:not(.active) {
  background: linear-gradient(135deg, #f5f7f5 0%, #f0f2f0 100%);
  border-color: #e0e0e0;
}

.feature-card.completed:not(.active) .feature-title,
.feature-card.completed:not(.active) .feature-description {
  color: #999;
  text-decoration: line-through;
}

.feature-card.completed:not(.active) .feature-tip {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.05));
  border-left-color: #999;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #BA955C;
  margin-top: 2px;
  cursor: pointer;
}

.must-see-full-width {
  width: 100%;
  margin: 40px 0;
  box-sizing: border-box;
  padding: 0 10px;
}

.must-see-banner {
  width: 100%;
  max-height: 250px;
  height: auto;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(186, 149, 92, 0.15);
  transition: all 0.3s ease;
  box-sizing: border-box;
  border-radius: 16px; /* 添加圆角 */
}

.must-see-banner:hover {
  transform: scale(1.02);
  box-shadow: 0 15px 40px rgba(186, 149, 92, 0.25);
}

/* 响应式高度调整 */
@media (max-width: 768px) {
  .must-see-full-width {
    margin: 25px 0;
    padding: 0 8px;
  }

  .must-see-banner {
    max-height: 200px;
    height: auto;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .must-see-full-width {
    margin: 20px 0;
    padding: 0 4px;
  }

  .must-see-banner {
    max-height: 150px;
    height: auto;
    border-radius: 10px;
  }
}

/* 新手必看部分 */
.checklist-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  width: calc(100% - 40px);
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px; /* 添加左右边距 */
}

/* 添加容器限制宽度并居中 */
.checklist-section {
  max-width: 1200px;
  margin: 20px auto;
}

.info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #eef2f7;
  box-sizing: border-box;
  max-width: 100%;
  padding: 12px;
}

.info-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.checklist-container,
.faq-container,
.model-faq-container {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  border: 1px solid #eef2f7;
  box-sizing: border-box;
  max-width: 100%;
}

/* 新增的无padding类 */
.no-padding {
  padding: 0;
}

/* 桌面端布局 */
.checklist-container {
  display: flex;
  min-height: 120px; /* 减小高度 */
}

.checklist-container .info-image-wrapper {
  flex: 1;
  position: relative;
  box-sizing: border-box;
}

.checklist-container .info-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.checklist-container .info-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.checklist-container .info-content {
  flex: 1;
  padding: 6px; /* 减小内边距 */
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

/* 桌面端常见问题 */
.faq-container {
  display: flex;
  min-height: 350px; /* 增加高度 */
}

.faq-container .info-content {
  flex: 1;
  padding: 14px; /* 增加内边距 */
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.faq-container .info-image-wrapper {
  flex: 1;
  position: relative;
  box-sizing: border-box;
}

.faq-container .info-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
}

.faq-container .info-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(42, 53, 53, 0.6);
  z-index: 1;
}

@media (max-width: 768px) {
  .info-title {
    font-size: 24px;
    padding: 12px;
  }
}


/* 移动端常见问题 */
.model-faq-container {
  display: none;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 16px;
}

/* 图像区域 */
.info-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.info-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.info-title {
  position: relative;
  z-index: 2;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin: 0;
  padding: 0 10px;
  box-sizing: border-box;
}

/* 内容区域 */
.info-content {
  flex: 1;
  padding: 10px;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}

.info-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, #BA955C, #2A3535);
}

/* 列表样式 */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #333;
  flex: 1;
  box-sizing: border-box;
  width: 100%;
}

.checklist-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

.checklist-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 10px rgba(186, 149, 92, 0.15);
}

.checklist-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: #BA955C;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.checklist-item:hover::before {
  transform: scaleY(1);
}

/* 新增容器样式 */
.checklist-content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  cursor: pointer;
  flex: 1;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkmark::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background-color: #BA955C;
  border-color: #BA955C;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  opacity: 1;
}

.check-text {
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  transition: all 0.3s ease;
  word-break: break-word;
  box-sizing: border-box;
}

.checkbox-label input[type="checkbox"]:checked ~ .check-text {
  color: #666;
  text-decoration: line-through;
}

.item-icon {
  width: 40%;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 4px;
  margin-left: 15px;
}

/* 进度显示 */
.progress-summary {
  padding-top: 10px;
  border-top: 1px dashed #ddd;
  box-sizing: border-box;
  width: 100%;
}

/* 添加安全提示样式 */
.safety-tip {
  font-size: 12px;
  margin-bottom: 4px;
  font-weight: 500;
  box-sizing: border-box;
}

.safety-tip-danger {
  color: #f56c6c; /* 红色 */
}

.safety-tip-warning {
  color: #409eff; /* 蓝色 */
}

.safety-tip-success {
  color: #67c23a; /* 绿色 */
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
  box-sizing: border-box;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #BA955C, #2A3535);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  text-align: right;
  font-weight: 500;
  box-sizing: border-box;
}

/* 列表样式 (桌面端) */
.checklist-list,
.faq-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  box-sizing: border-box;
  width: 100%;
}

.checklist-list li,
.faq-list li {
  display: flex;
  align-items: center;
  gap: 5px;
  box-sizing: border-box;
  width: 100%;
}

/* 常见问题列表项 */
.faq-item {
  margin-bottom: 10px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.faq-item:hover {
  background: #fff9f0;
  border-color: #BA955C;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  font-weight: 500;
  color: #2A3535;
  transition: background-color 0.2s;
}

.faq-question:hover {
  background-color: #fafafa;
}

.faq-text {
  flex: 1;
  text-align: left;
}

.faq-icon {
  transition: transform 0.3s ease;
  margin-left: 10px;
}

.faq-icon.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 15px 15px;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
  text-align: left;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

/* 优化FAQ展开动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.model-faq-container .info-image-wrapper {
  width: 100%;
  position: relative;
  box-sizing: border-box;
}

.model-faq-container .info-image.mobile-header {
  height: 120px;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.model-faq-container .info-title {
  font-size: 24px;
  box-sizing: border-box;
}

.model-faq-container .info-content {
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
}

.model-faq-container .info-list {
  font-size: 13px;
  box-sizing: border-box;
  width: 100%;
}

.model-faq-container .faq-list li {
  padding: 8px 10px;
  margin-bottom: 8px;
  box-sizing: border-box;
  width: 100%;
}

.checklist-list input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #BA955C;
}

/* 常见问题列表项 */
.faq-list li {
  margin-bottom: 6px;
  box-sizing: border-box;
  width: 100%;
}

.model-faq-list li {
  margin-bottom: 6px;
  box-sizing: border-box;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .faq-container {
    display: none;
  }

  .model-faq-container {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .checklist-section {
    gap: 15px;
    margin: 15px 0;
    padding: 0 12px;
    width: 100%;
  }

  .checklist-container,
  .faq-container {
    flex-direction: column;
    min-height: auto;
  }

  .checklist-container .info-image-wrapper {
    width: 100%;
    height: 180px;
  }

  .checklist-container .info-image {
    position: relative;
    height: 180px;
  }

  .checklist-container .info-content,
  .faq-container .info-content,
  .model-faq-container .info-content {
    width: 100%;
    padding: 12px;
  }

  .info-image {
    width: 100%;
    height: 150px;
  }

  .info-title {
    font-size: 18px;
    padding: 12px;
  }

  .info-content {
    padding: 12px;
  }

  .info-list {
    font-size: 13px;
  }

  .info-list li {
    margin-bottom: 6px;
  }

  .checkbox-label {
    gap: 6px;
  }

  .checkbox-label input[type="checkbox"] {
    width: 14px;
    height: 14px;
    margin-top: 3px;
  }

  .faq-list li {
    padding: 6px;
    margin-bottom: 6px;
  }

  .checklist-list,
  .faq-list {
    font-size: 12px;
  }

  .checklist-container .info-image,
  .model-faq-container .info-image.mobile-header {
    height: 25vh;
    min-height: 150px;
  }

  .checklist-container .info-image,
  .model-faq-container .info-image.mobile-header {
    width: 100%;
  }

  .checklist-item {
    padding: 6px 8px;
    margin-bottom: 8px;
  }

  .check-text {
    font-size: 13px;
  }

  .item-icon {
    width: 60%;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .checklist-section {
    gap: 12px;
    margin: 12px 0;
    padding: 0 8px; /* 小屏幕边距调整 */
  }

  .info-image {
    height: 130px;
  }

  .info-title {
    font-size: 16px;
    padding: 10px;
  }

  .info-content {
    padding: 10px;
  }

  .info-list {
    font-size: 12px;
  }

  .info-list li {
    margin-bottom: 5px;
  }

  .checkbox-label {
    gap: 5px;
  }

  .checkbox-label input[type="checkbox"] {
    width: 13px;
    height: 13px;
    margin-top: 3px;
  }

  .faq-list li {
    padding: 5px;
    font-size: 12px;
  }

  .model-faq-container .info-image.mobile-header {
    height: 100px;
  }

  .model-faq-container .info-title {
    font-size: 16px;
  }

  .model-faq-container .info-content {
    padding: 10px;
  }

  .model-faq-container .info-list {
    font-size: 12px;
  }

  .checklist-list,
  .faq-list {
    font-size: 11px;
  }

  .checklist-container .info-image,
  .model-faq-container .info-image.mobile-header {
    height: 25vh;
    min-height: 120px;
  }

  .checklist-item {
    padding: 5px 6px;
    margin-bottom: 6px;
  }

  .check-text {
    font-size: 12px;
  }

  .item-icon {
    width: 60%;
    height: 30px;
  }

  .progress-text {
    font-size: 11px;
  }
}

@media (min-width: 769px) {
  .checklist-container,
  .faq-container {
    display: flex;
    gap: 0;
    min-height: 25vh;
  }

  .checklist-container .info-image-wrapper {
    width: 50%;
  }

  .checklist-container .info-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .checklist-container .info-content {
    width: 50%;
    padding: 6px; /* 减小内边距 */
  }

  .faq-container .info-image-wrapper {
    width: 50%;
  }

  .faq-container .info-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .faq-container .info-content {
    flex: 1;
    width: 50%;
    padding: 14px; /* 增加内边距 */
  }

  .info-title {
    font-size: 24px;
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .checklist-container,
  .faq-container {
    flex-direction: column;
  }

  .checklist-container .info-image,
  .faq-container .info-image {
    width: 100%;
    height: 150px;
  }

  /* 移动端标题居中 */
  .checklist-container .info-image,
  .model-faq-container .info-image.mobile-header {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .checklist-container .info-image .info-title,
  .model-faq-container .info-image.mobile-header .info-title {
    text-align: center;
    width: 100%;
  }

  .model-faq-container .info-image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .model-faq-container .info-image.mobile-header {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .model-faq-container .info-image.mobile-header .info-title {
    text-align: center;
    width: 100%;
  }
}

/* 修改背景图自适应样式 */
.checklist-container .info-image,
.faq-container .info-image,
.model-faq-container .info-image.mobile-header {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
}

/* 修复常见问题背景图片自适应问题 */
.faq-container .info-image,
.model-faq-container .info-image.mobile-header {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.more-section-container {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.more-section {
  width: 100%;
  height: 33vh;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.more-content {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 15px;
  box-sizing: border-box;
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 16px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .more-section {
    height: 20vh;
    min-height: 120px;
    margin: 0;
    padding: 0;
  }

  .more-content {
    font-size: var(--font-size-base);
    padding: 12px;
    border-radius: 12px;
  }

  .large-title {
    font-size: clamp(18px, 5vw, 24px);
    padding: 12px;
  }

  .large-text,
  .more-content {
    font-size: clamp(16px, 4vw, 20px);
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .more-section {
    height: 20vh;
    min-height: 100px;
    margin: 0;
    padding: 0;
  }

  .more-content {
    font-size: var(--font-size-sm);
    padding: 10px;
    border-radius: 10px;
  }

  .large-title {
    font-size: clamp(16px, 5vw, 20px);
    padding: 10px;
  }

  .large-text,
  .more-content {
    font-size: clamp(14px, 4vw, 18px);
    padding: 10px;
  }
}

.large-title {
  font-size: clamp(20px, 4vw, 28px);
  padding: 15px;
  line-height: 1.3;
}

.large-text {
  font-size: clamp(20px, 4vw, 28px);
  line-height: 1.3;
  letter-spacing: 1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.contact-section {
  text-align: left;
  padding: 40px 60px;
  margin-top: 40px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid #e0e0e0;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

.contact-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #BA955C, #2A3535);
}

.contact-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #2A3535;
  margin-bottom: 25px;
  line-height: 1.5;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}

.contact-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #BA955C, #2A3535);
  border-radius: 2px;
}

/* 联系图标美化 */
.contact-links {
  display: flex;
  justify-content: left;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 30px;
  box-sizing: border-box;
  width: 100%;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2A3535;
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  padding: 10px 14px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  min-width: 180px;
  box-sizing: border-box;
}

.contact-link:hover {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(186, 149, 92, 0.15);
  border-color: #BA955C;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 6px;
  box-sizing: border-box;
}

.contact-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.contact-link .text {
  font-weight: 500;
}

@media (max-width: 1200px) {
  .contact-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 992px) {
  .contact-title {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 30px 20px;
  }

  .contact-links {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 25px;
  }

  .contact-link {
    width: 100%;
    max-width: 300px;
    padding: 8px 12px;
    min-width: unset;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
    padding: 6px;
  }

  .feature-card {
    padding: 20px 15px;
  }

  .progress-bar .step {
    width: 40px;
    height: 40px;
    font-size: 12px;
    font-weight: 400;
  }
}

@media (max-width: 480px) {
  .contact-section {
    padding: 20px 10px;
  }

  .contact-links {
    gap: 10px;
    margin-top: 20px;
  }

  .contact-link {
    padding: 6px 10px;
    min-width: 100%;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
    padding: 6px;
  }

  .contact-title {
    font-size: var(--font-size-lg);
  }

  .contact-link {
    min-width: 100%;
  }

  .contact-links {
    flex-direction: column;
    align-items: center;
  }
}

/* 微交互动效 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(186, 149, 92, 0.4);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(186, 149, 92, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(186, 149, 92, 0);
  }
}

/* 小屏幕优化 */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px 30px;
    text-align: center;
  }

  .hero-content {
    margin-left: 0;
    padding: 0 15px;
  }

  .hero-badge {
    margin-bottom: 12px;
  }

  .badge-text {
    font-size: 11px;
    padding: 6px 12px;
  }

  .hero-title {
    font-size: 24px;
    margin: 12px 0 15px;
    line-height: 1.3;
  }

  .gradient-text {
    font-size: 13px;
    line-height: 1.4;
  }

  .hero-actions {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    max-width: 280px;
    padding: 10px 20px;
    font-size: 14px;
  }

  .hero-visual {
    margin-top: 25px;
    justify-content: center;
  }

  .visual-container {
    width: 250px;
    height: 250px;
  }

  .features-section {
    padding: 40px 0 20px;
  }

  .section-header {
    margin-bottom: 30px;
    padding: 0 15px;
  }

  .section-header h2 {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 0 15px;
  }

  .feature-card {
    padding: 20px 15px;
    border-radius: 12px;
  }

  .feature-card:nth-child(n) {
    grid-column: 1 !important;
    grid-row: auto !important;
  }

  .feature-title {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .feature-description {
    font-size: 13px;
  }

  .feature-tip {
    padding: 12px;
    margin-top: 12px;
  }

  .tip-content {
    font-size: 12px;
  }

  .feature-image-right {
    width: 70px;
    margin-top: 8px;
  }

  .progress-section {
    padding: 0 10px;
  }

  .progress-bar {
    margin: 12px 0;
    padding: 8px 12px;
  }

  .progress-bar .step {
    width: 35px;
    height: 35px;
    font-size: 12px;
    font-weight: 400;
  }

  .progress-bar::before {
    height: 4px;
  }

  .checklist-section {
    gap: 15px;
    margin: 15px 0;
  }

  .info-card {
    border-radius: 12px;
    padding: 0;
  }

  .checklist-container,
  .faq-container,
  .model-faq-container {
    border-radius: 12px;
  }

  .info-content {
    padding: 10px;
  }

  .info-title {
    font-size: 24px;
  }

  .checklist-item {
    padding: 6px;
    margin-bottom: 8px;
    gap: 6px;
  }

  .check-text {
    font-size: 13px;
  }

  .item-icon {
    width: 60%;
    height: 50px;
  }

  .progress-summary {
    margin-top: 10px;
    padding-top: 10px;
  }

  .safety-tip {
    font-size: 11px;
    margin-bottom: 4px;
  }

  .progress-text {
    font-size: 11px;
  }

  .faq-list li {
    padding: 6px;
    margin-bottom: 6px;
    font-size: 13px;
  }

  .contact-section {
    padding: 30px 20px;
    margin-top: 30px;
  }

  .contact-title {
    font-size: 20px;
    margin-bottom: 20px;
    text-align: left;
    width: 100%;
  }

  .contact-links {
    justify-content: center;
    gap: 12px;
    margin-top: 25px;
  }

  .contact-link {
    width: 100%;
    max-width: 300px;
    padding: 6px 10px;
    min-width: 220px;
    font-size: 13px;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 50px 15px 25px;
  }

  .hero-title {
    font-size: 20px;
  }

  .gradient-text {
    font-size: 12px;
  }

  .primary-button,
  .secondary-button {
    padding: 8px 16px;
    font-size: 13px;
    max-width: 220px;
  }

  .features-section {
    padding: 30px 0 15px;
  }

  .section-header h2 {
    font-size: 18px;
  }

  .feature-card {
    padding: 15px 12px;
  }

  .feature-title {
    font-size: 16px;
  }

  .feature-description {
    font-size: 12px;
  }

  .feature-tip {
    padding: 10px;
  }

  .tip-content {
    font-size: 11px;
  }

  .progress-bar {
    margin: 10px 0;
    padding: 6px 8px;
  }

  .progress-bar .step {
    width: 30px;
    height: 30px;
    font-size: 10px;
    font-weight: 400;
  }

  .progress-bar::before {
    height: 3px;
  }

  .checklist-section {
    gap: 12px;
    margin: 12px 0;
  }

  .info-content {
    padding: 8px;
  }

  .info-title {
    font-size: 18px;
  }

  .checklist-item {
    padding: 5px;
    margin-bottom: 6px;
    gap: 5px;
  }

  .check-text {
    font-size: 12px;
  }

  .item-icon {
    width: 60%;
    height: 25px;
  }

  .faq-list li {
    padding: 5px;
    margin-bottom: 5px;
    font-size: 12px;
  }

  .progress-text {
    font-size: 10px;
  }

  .safety-tip {
    font-size: 10px;
  }

  .contact-section {
    padding: 20px 15px;
    margin-top: 20px;
  }

  .contact-title {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .contact-links {
    gap: 10px;
    margin-top: 20px;
  }

  .contact-link {
    padding: 5px 8px;
    min-width: 200px;
    font-size: 12px;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
    padding: 5px;
  }

  /* 移动端优化 */
  .hero-badge {
    margin-bottom: 10px;
  }

  .badge-text {
    font-size: 10px;
    padding: 5px 10px;
  }

  .hero-title {
    font-size: 22px;
    margin: 10px 0 15px;
  }

  .gradient-text {
    font-size: 12px;
  }

  .hero-actions {
    gap: 10px;
  }

  .primary-button,
  .secondary-button {
    padding: 8px 16px;
    font-size: 13px;
  }

  .section-header h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .section-header p {
    font-size: 14px;
  }

  .feature-card {
    padding: 15px 12px;
  }

  .feature-title {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .feature-description {
    font-size: 12px;
  }

  .checklist-item {
    padding: 5px 6px;
    margin-bottom: 6px;
  }

  .check-text {
    font-size: 12px;
  }

  .item-icon {
    width: 50%;
    height: 20px;
  }

  .contact-title {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .contact-link {
    padding: 5px 8px;
    font-size: 12px;
  }
}
</style>
