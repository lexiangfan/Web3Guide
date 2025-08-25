<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
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
            访问 imKey 官网
          </el-button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-container">
          <div class="key-scene">
            <div class="key-wrapper">
              <div class="key-3d">
                <!-- 钥匙外壳 -->
                <div class="key-case">
                  <div class="case-surface front">
                    <div class="case-reflection"></div>
                  </div>
                  <div class="case-surface back"></div>
                  <div class="case-surface top"></div>
                  <div class="case-surface bottom"></div>
                  <div class="case-surface left"></div>
                  <div class="case-surface right"></div>
                  <div class="case-inner-hole"></div>
                </div>

                <!-- 钥匙头部 (带凹槽和纹理) -->
                <div class="key-head">
                  <div class="head-surface front">
                    <div class="head-detail detail-1"></div>
                    <div class="head-detail detail-2"></div>
                    <div class="head-groove-main"></div>
                  </div>
                  <div class="head-surface back"></div>
                  <div class="head-surface top"></div>
                  <div class="head-surface bottom"></div>
                  <div class="head-surface left"></div>
                  <div class="head-surface right"></div>
                </div>

                <!-- 钥匙杆部 (带纹理) -->
                <div class="key-shaft">
                  <div class="shaft-surface front">
                    <div class="shaft-line line-1"></div>
                    <div class="shaft-line line-2"></div>
                    <div class="shaft-line line-3"></div>
                  </div>
                  <div class="shaft-surface back"></div>
                  <div class="shaft-surface top"></div>
                  <div class="shaft-surface bottom"></div>
                  <div class="shaft-surface left"></div>
                  <div class="shaft-surface right"></div>
                </div>

                <!-- 钥匙齿部 (更复杂的形状) -->
                <div class="key-teeth">
                  <div class="tooth tooth-1">
                    <div class="tooth-edge"></div>
                  </div>
                  <div class="tooth tooth-2">
                    <div class="tooth-edge"></div>
                  </div>
                  <div class="tooth tooth-3">
                    <div class="tooth-edge"></div>
                  </div>
                  <div class="tooth tooth-4">
                    <div class="tooth-edge"></div>
                  </div>
                  <div class="tooth tooth-5">
                    <div class="tooth-edge"></div>
                  </div>
                </div>

                <!-- 钥匙装饰环 (更立体) -->
                <div class="key-ring">
                  <div class="ring-surface front">
                    <div class="ring-inner-hole"></div>
                  </div>
                  <div class="ring-surface back"></div>
                  <div class="ring-surface top"></div>
                  <div class="ring-surface bottom"></div>
                  <div class="ring-surface left"></div>
                  <div class="ring-surface right"></div>
                  <div class="ring-inner-glow"></div>
                </div>

                <!-- 钥匙光泽效果 -->
                <div class="key-highlight highlight-1"></div>
                <div class="key-highlight highlight-2"></div>
              </div>
            </div>
          </div>
          <div class="floating-elements">
            <div class="floating-element element-1"></div>
            <div class="floating-element element-2"></div>
            <div class="floating-element element-3"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="section-header">
        <h2>“一步步开箱，安全不会出错”</h2>
      </div>

      <section
          class="progress-section-wrapper"
          :class="{ 'pinned-wrapper': isPinned }"
      >
        <div
            class="progress-section"
            :class="{ pinned: isPinned }"
            ref="progressSectionRef"
        >
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
          <div class="feature-link" @click.stop v-html="feature.link"></div>
          <div v-if="feature.image" class="feature-image-right">
            <img
                :src="getStepImage(index)"
                :alt="`Step ${index + 1}: ${feature.title}`"
                style="width: 100%; max-width: 100px; height: auto;">
          </div>
        </div>
      </div>
    </section>

    <div class="must-see-full-width">
      <img :src="must" alt="新手必读" class="must-see-banner">
    </div>

    <div class="checklist-section">
      <!-- 新手必看：自我检查 -->
      <div class="info-card checklist-container">
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
      <div class="info-card faq-container">
        <!-- 左侧内容 -->
        <div class="info-content">
          <ul class="info-list faq-list">
            <li>什么是助记词？</li>
            <li>如果钱包丢了怎么办？</li>
            <li>支持哪些币种？</li>
            <li>如何验证我的钱包是真品？</li>
          </ul>
        </div>

        <!-- 右侧图像区域 -->
        <div class="info-image" :style="{ backgroundImage: `url(${question})` }">
          <h3 class="info-title large-title">常见问题，一看就懂</h3>
        </div>
      </div>

      <!-- 常见问题 (移动端显示) -->
      <div class="info-card model-faq-container">
        <!-- 上方图像区域 -->
        <div class="info-image-wrapper">
          <div class="info-image mobile-header" :style="{ backgroundImage: `url(${question})` }">
            <h3 class="info-title large-title">常见问题，一看就懂</h3>
          </div>
        </div>

        <!-- 下方内容区域 -->
        <div class="info-content">
          <ul class="info-list faq-list">
            <li>什么是助记词？</li>
            <li>如果钱包丢了怎么办？</li>
            <li>支持哪些币种？</li>
            <li>如何验证我的钱包是真品？</li>
          </ul>
        </div>
      </div>
    </div>

    <section class="more-section">
      <div class="more-content" :style="{ backgroundImage: `url(${more})` }">
        <span class="large-text">不止imToken，连接Rabby，解锁更多 Web3 体验</span>
      </div>
    </section>
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
import router from "@/router/router.js";
import { ArrowRight } from '@element-plus/icons-vue'
import step1 from'@/public/images/step1.png'
import step2 from'@/public/images/step2.png'
import step3 from'@/public/images/step3.png'
import step4 from'@/public/images/step4.png'
import step5 from'@/public/images/step5.png'
import greenHand from'@/public/images/greenHand.png'
import imKeyCom from'@/public/images/imKeyCom.png'
import must from'@/public/images/must.png'
import question from'@/public/images/question.png'
import more from'@/public/images/more.png'
import CustomDialog from "@/components/CustomDialog.vue";
import imKey_logo from "@/public/images/logo/imKey_logo1.png"
import imKey_logo2 from "@/public/images/logo/imKey_logo2.png"
import imKey_logo3 from "@/public/images/logo/imKey_logo3.png"
import imKey_logo4 from "@/public/images/logo/imKey_logo4.png"

const stepImages = [step1, step2, step3, step4, step5]

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
    link: `<a href="/page" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
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
    link: `<a href="/page" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
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
    link: `<a href="/page" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
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
    link: `<a href="/page" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
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
    link: `<a href="/page" style="color: #409eff; text-decoration: none; font-size: 16px;">点击了解更多 &raquo;</a>`,
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

// 进度条固钉相关
const progressSectionRef = ref(null)
const isPinned = ref(false)
const progressOriginalTop = ref(0)

// 检查是否所有步骤已完成
const isAllStepsCompleted = () => {
  return progressSteps.value.every(step => step.status === 'completed')
}

// 处理滚动事件 - 优化固钉逻辑
const handleScroll = () => {
  if (!progressSectionRef.value) return

  const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'))
  const progressSectionRect = progressSectionRef.value.getBoundingClientRect()

  // 记录进度条原始位置（只在初始时记录一次）
  if (progressOriginalTop.value === 0 && progressSectionRef.value.offsetTop) {
    progressOriginalTop.value = progressSectionRef.value.offsetTop
  }

  // 获取页面滚动位置
  const scrollTop = window.scrollY || window.pageYOffset

  // 当滚动位置在进度条原始位置之前，取消固定
  if (scrollTop < progressOriginalTop.value) {
    isPinned.value = false
    return
  }

  // 固定条件：滚动超过原始位置、未完成所有步骤、进度条仍在视口中
  const shouldPin = scrollTop >= progressOriginalTop.value &&
      !isAllStepsCompleted() &&
      progressSectionRect.bottom >= navbarHeight

  isPinned.value = shouldPin
}

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

  // 检查是否所有步骤已完成，如果是则取消固钉
  if (isAllStepsCompleted()) {
    isPinned.value = false
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadProgress()
  loadSessionState() // 加载会话状态
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.feature-image-right {
  float: right;
  margin-left: 10px;
  margin-right: -5px;
  margin-top: 15px;
  width: 100px;
  height: auto;
}

.key-scene {
  width: 350px;
  height: 350px;
  perspective: 1500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 在桌面端让钥匙变大 */
@media (min-width: 769px) {
  .key-scene {
    width: 450px;
    height: 450px;
  }

  .key-wrapper {
    transform: scale(1.4);
  }
}

.key-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.key-3d {
  position: relative;
  transform-style: preserve-3d;
  animation: rotateKey 30s infinite linear;
  transform: rotateX(15deg);
}

@keyframes rotateKey {
  0% {
    transform: rotateX(15deg) rotateY(0) rotateZ(0);
    filter: drop-shadow(0 0 10px rgba(186, 149, 92, 0.5));
  }
  100% {
    transform: rotateX(15deg) rotateY(360deg) rotateZ(360deg);
    filter: drop-shadow(0 0 20px rgba(186, 149, 92, 0.8));
  }
}

/* 钥匙外壳 */
.key-case {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateX(-35px);
  transform-style: preserve-3d;
}

.case-surface {
  position: absolute;
  box-shadow: 0 0 15px rgba(138, 109, 66, 0.8);
}

.case-surface.front {
  width: 65px;
  height: 65px;
  transform: translateZ(15px);
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #f8f0e5, #e6d5bb 40%, #d4b68c 70%, #c2a070);
  overflow: hidden;
}

.case-reflection {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  top: 15px;
  left: 15px;
  filter: blur(3px);
}

.case-surface.back {
  width: 65px;
  height: 65px;
  transform: translateZ(-15px) rotateY(180deg);
  border-radius: 50%;
  background: radial-gradient(circle at 70% 70%, #c2a070, #d4b68c 40%, #e6d5bb 70%, #f8f0e5);
}

.case-surface.top {
  width: 65px;
  height: 30px;
  transform: translateY(-15px) rotateX(90deg);
  border-radius: 50% 50% 0 0;
  background: linear-gradient(to bottom, #f8f0e5, #e6d5bb, #d4b68c);
}

.case-surface.bottom {
  width: 65px;
  height: 30px;
  transform: translateY(15px) rotateX(-90deg);
  border-radius: 0 0 50% 50%;
  background: linear-gradient(to top, #c2a070, #d4b68c, #e6d5bb);
}

.case-surface.left {
  width: 30px;
  height: 65px;
  transform: translateX(-15px) rotateY(-90deg);
  border-radius: 50% 0 0 50%;
  background: linear-gradient(to right, #c2a070, #d4b68c, #e6d5bb);
}

.case-surface.right {
  width: 30px;
  height: 65px;
  transform: translateX(15px) rotateY(90deg);
  border-radius: 0 50% 50% 0;
  background: linear-gradient(to left, #c2a070, #d4b68c, #e6d5bb);
}

.case-inner-hole {
  position: absolute;
  width: 45px;
  height: 45px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(16px);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.9);
}

/* 钥匙头部 */
.key-head {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
}

.head-surface {
  position: absolute;
  box-shadow: 0 0 12px rgba(186, 149, 92, 0.6);
}

.head-surface.front {
  width: 55px;
  height: 55px;
  transform: translateZ(12px);
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #e6c9a1, #d4b68c 40%, #BA955C 70%, #8a6d42);
  overflow: hidden;
}

.head-detail {
  position: absolute;
  background: rgba(138, 109, 66, 0.3);
  border-radius: 50%;
}

.head-detail.detail-1 {
  width: 12px;
  height: 12px;
  top: 15px;
  left: 15px;
}

.head-detail.detail-2 {
  width: 8px;
  height: 8px;
  bottom: 12px;
  right: 10px;
}

.head-groove-main {
  position: absolute;
  width: 25px;
  height: 6px;
  background: rgba(138, 109, 66, 0.6);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.4);
}

.head-surface.back {
  width: 55px;
  height: 55px;
  transform: translateZ(-12px) rotateY(180deg);
  border-radius: 50%;
  background: radial-gradient(circle at 70% 70%, #8a6d42, #BA955C 40%, #d4b68c 70%, #e6c9a1);
}

.head-surface.top {
  width: 55px;
  height: 24px;
  transform: translateY(-12px) rotateX(90deg);
  border-radius: 50% 50% 0 0;
  background: linear-gradient(to bottom, #e6c9a1, #d4b68c, #BA955C);
}

.head-surface.bottom {
  width: 55px;
  height: 24px;
  transform: translateY(12px) rotateX(-90deg);
  border-radius: 0 0 50% 50%;
  background: linear-gradient(to top, #8a6d42, #BA955C, #d4b68c);
}

.head-surface.left {
  width: 24px;
  height: 55px;
  transform: translateX(-12px) rotateY(-90deg);
  border-radius: 50% 0 0 50%;
  background: linear-gradient(to right, #8a6d42, #BA955C, #d4b68c);
}

.head-surface.right {
  width: 24px;
  height: 55px;
  transform: translateX(12px) rotateY(90deg);
  border-radius: 0 50% 50% 0;
  background: linear-gradient(to left, #8a6d42, #BA955C, #d4b68c);
}

/* 钥匙杆部 */
.key-shaft {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateX(50px);
  transform-style: preserve-3d;
}

.shaft-surface {
  position: absolute;
  box-shadow: 0 0 8px rgba(186, 149, 92, 0.4);
}

.shaft-surface.front {
  width: 110px;
  height: 10px;
  transform: translateZ(3px);
  border-radius: 3px;
  background: linear-gradient(to right, #e6c9a1, #d4b68c 30%, #BA955C 50%, #8a6d42 70%, #5a4525);
  overflow: hidden;
}

.shaft-line {
  position: absolute;
  height: 1px;
  background: rgba(90, 69, 37, 0.4);
}

.shaft-line.line-1 {
  width: 80px;
  top: 3px;
  left: 15px;
}

.shaft-line.line-2 {
  width: 60px;
  top: 5px;
  left: 25px;
}

.shaft-line.line-3 {
  width: 70px;
  top: 7px;
  left: 20px;
}

.shaft-surface.back {
  width: 110px;
  height: 10px;
  transform: translateZ(-3px) rotateY(180deg);
  border-radius: 3px;
  background: linear-gradient(to left, #e6c9a1, #d4b68c 30%, #BA955C 50%, #8a6d42 70%, #5a4525);
}

.shaft-surface.top {
  width: 110px;
  height: 6px;
  transform: translateY(-3px) rotateX(90deg);
  border-radius: 3px;
  background: linear-gradient(to bottom, #e6c9a1, #d4b68c, #BA955C);
}

.shaft-surface.bottom {
  width: 110px;
  height: 6px;
  transform: translateY(3px) rotateX(-90deg);
  border-radius: 3px;
  background: linear-gradient(to top, #5a4525, #8a6d42, #BA955C);
}

.shaft-surface.left {
  width: 6px;
  height: 10px;
  transform: translateX(-3px) rotateY(-90deg);
  border-radius: 2px;
  background: linear-gradient(to right, #5a4525, #8a6d42, #BA955C);
}

.shaft-surface.right {
  width: 6px;
  height: 10px;
  transform: translateX(113px) rotateY(90deg);
  border-radius: 2px;
  background: linear-gradient(to left, #5a4525, #8a6d42, #BA955C);
}

/* 钥匙齿部 */
.key-teeth {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateX(105px);
  transform-style: preserve-3d;
}

.tooth {
  position: absolute;
  transform-style: preserve-3d;
}

.tooth-1 {
  width: 6px;
  height: 14px;
  transform: translateX(0) translateY(-7px);
  background: linear-gradient(to bottom, #d4b68c, #BA955C, #8a6d42);
  border-radius: 0 0 2px 2px;
  box-shadow: 0 1px 4px rgba(90, 69, 37, 0.6);
}

.tooth-2 {
  width: 7px;
  height: 18px;
  transform: translateX(15px) translateY(-9px);
  background: linear-gradient(to bottom, #d4b68c, #BA955C, #5a4525);
  border-radius: 0 0 3px 3px;
  box-shadow: 0 1px 4px rgba(90, 69, 37, 0.6);
}

.tooth-3 {
  width: 8px;
  height: 12px;
  transform: translateX(32px) translateY(-6px);
  background: linear-gradient(to bottom, #e6c9a1, #d4b68c, #8a6d42);
  border-radius: 0 0 3px 3px;
  box-shadow: 0 1px 4px rgba(90, 69, 37, 0.6);
}

.tooth-4 {
  width: 6px;
  height: 16px;
  transform: translateX(48px) translateY(-8px);
  background: linear-gradient(to bottom, #d4b68c, #BA955C, #5a4525);
  border-radius: 0 0 2px 2px;
  box-shadow: 0 1px 4px rgba(90, 69, 37, 0.6);
}

.tooth-5 {
  width: 7px;
  height: 13px;
  transform: translateX(62px) translateY(-6.5px);
  background: linear-gradient(to bottom, #e6c9a1, #BA955C, #8a6d42);
  border-radius: 0 0 3px 3px;
  box-shadow: 0 1px 4px rgba(90, 69, 37, 0.6);
}

.tooth-edge {
  position: absolute;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  top: 2px;
  border-radius: 1px;
}

/* 钥匙装饰环 */
.key-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateX(-45px);
  transform-style: preserve-3d;
}

.ring-surface {
  position: absolute;
  box-shadow: 0 0 15px rgba(186, 149, 92, 0.7);
}

.ring-surface.front {
  width: 30px;
  height: 40px;
  transform: translateZ(4px);
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #f0d9b9, #e0c49a 40%, #c9a774 70%, #a18355);
  overflow: hidden;
}

.ring-inner-hole {
  position: absolute;
  width: 18px;
  height: 28px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.9);
}

.ring-surface.back {
  width: 30px;
  height: 40px;
  transform: translateZ(-4px) rotateY(180deg);
  border-radius: 50%;
  background: radial-gradient(circle at 70% 70%, #a18355, #c9a774 40%, #e0c49a 70%, #f0d9b9);
}

.ring-surface.top {
  width: 30px;
  height: 8px;
  transform: translateY(-20px) rotateX(90deg);
  border-radius: 50%;
  background: linear-gradient(to bottom, #f0d9b9, #e0c49a, #c9a774);
}

.ring-surface.bottom {
  width: 30px;
  height: 8px;
  transform: translateY(20px) rotateX(-90deg);
  border-radius: 50%;
  background: linear-gradient(to top, #a18355, #c9a774, #e0c49a);
}

.ring-surface.left {
  width: 8px;
  height: 40px;
  transform: translateX(-15px) rotateY(-90deg);
  border-radius: 50%;
  background: linear-gradient(to right, #a18355, #c9a774, #e0c49a);
}

.ring-surface.right {
  width: 8px;
  height: 40px;
  transform: translateX(15px) rotateY(90deg);
  border-radius: 50%;
  background: linear-gradient(to left, #a18355, #c9a774, #e0c49a);
}

.ring-inner-glow {
  position: absolute;
  width: 20px;
  height: 30px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 钥匙光泽效果 */
.key-highlight {
  position: absolute;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  filter: blur(2px);
}

.highlight-1 {
  width: 15px;
  height: 15px;
  top: 20%;
  left: 25%;
  transform: translateZ(15px);
}

.highlight-2 {
  width: 8px;
  height: 20px;
  top: 40%;
  left: 60%;
  transform: translateZ(5px);
}

/* 浮动元素 */
.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #BA955C 0%, #d4b68c 100%);
  opacity: 0.8;
  box-shadow: 0 4px 15px rgba(186, 149, 92, 0.3);
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    box-shadow: 0 4px 15px rgba(186, 149, 92, 0.3);
  }
  25% {
    transform: translateY(-25px) translateX(10px);
    box-shadow: 0 8px 20px rgba(186, 149, 92, 0.5);
  }
  50% {
    transform: translateY(0) translateX(20px);
    box-shadow: 0 4px 15px rgba(186, 149, 92, 0.3);
  }
  75% {
    transform: translateY(15px) translateX(10px);
    box-shadow: 0 6px 18px rgba(186, 149, 92, 0.4);
  }
}

/* 其他样式保持不变 */
.home-container {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.hero-section {
  display: flex;
  align-items: center;
  padding: 140px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  margin: 0;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(186, 149, 92, 0.1) 0%, rgba(186, 149, 92, 0.05) 100%);
  z-index: 0;
}

.hero-section::after {
  content: "";
  position: absolute;
  bottom: -80px;
  left: -30px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(42, 53, 53, 0.1) 0%, rgba(42, 53, 53, 0.05) 100%);
  z-index: 0;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  position: relative;
  z-index: 1;
  padding: 0 20px;
  margin-left: 6%;
}

.hero-badge {
  margin-bottom: 20px;
}

.badge-text {
  font-size: var(--font-size-xs);
  display: inline-block;
  background: linear-gradient(135deg, #BA955C 0%, #d4b68c 100%);
  color: #ffffff;
  padding: 10px 20px;
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
  font-size: var(--font-size-5xl);
  font-weight: 800;
  margin: 20px 0 30px;
  line-height: 1.2;
  color: #2A3535;
}

.gradient-text {
  font-size: var(--font-size-lg);
  background: linear-gradient(90deg, #BA955C 0%, #2A3535 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.5;
}

@media (max-width: 992px) {
  .gradient-text {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .gradient-text {
    font-size: 16px;
  }
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.primary-button {
  background-color: #2A3535 !important;
  border-color: #2A3535 !important;
  border-radius: 30px;
  padding: 14px 28px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 180px;
}

.primary-button:hover {
  background-color: #1a2222 !important;
  border-color: #1a2222 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 53, 53, 0.2);
}

.secondary-button {
  border-radius: 30px;
  padding: 14px 28px;
  border: 2px solid #e0e0e0 !important;
  color: #666666 !important;
  font-size: var(--font-size-sm);
  font-weight: 500;
  background: transparent !important;
  transition: all 0.3s ease;
  min-width: 180px;
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
  width: 400px;
  height: 400px;
}

@keyframes rotate {
  0% {
    transform: rotateX(0) rotateY(0);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #BA955C 0%, #d4b68c 100%);
  opacity: 0.8;
  box-shadow: 0 4px 15px rgba(186, 149, 92, 0.3);
}

.element-1 {
  top: 15%;
  left: 15%;
  animation: float 4s ease-in-out infinite;
}

.element-2 {
  top: 75%;
  right: 20%;
  animation: float 4s ease-in-out infinite 0.8s;
}

.element-3 {
  bottom: 25%;
  left: 10%;
  animation: float 4s ease-in-out infinite 1.6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-25px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(20px);
  }
  75% {
    transform: translateY(15px) translateX(10px);
  }
}

/* Features Section */
.features-section {
  padding: 80px 0;
  margin: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  padding: 0 20px;
}

.section-header h2 {
  font-size: var(--font-size-4xl);
  margin-bottom: 20px;
  color: #2A3535;
  font-weight: 800;
}

.section-header p {
  font-size: var(--font-size-lg);
  color: #666666;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: auto;
  gap: 30px;
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
    gap: 20px;
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
  padding: 40px 30px;
  text-align: left !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transform: translateY(0);
  box-sizing: border-box;
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
  background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);
}

.feature-card.active::before {
  transform: scaleX(1);
  height: 6px;
}

.feature-title {
  font-size: var(--font-size-2xl);
  margin-bottom: 20px;
  color: #2A3535;
  font-weight: 700;
  text-align: left;
}

.feature-description {
  font-size: var(--font-size-base);
  color: #666666;
  line-height: 1.7;
  text-align: left;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 60px 0;
  }

  .hero-content {
    margin-bottom: 50px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-actions {
    justify-content: center;
  }

  .visual-container {
    width: 350px;
    height: 350px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
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
    font-size: 28px;
  }

  .section-header p {
    font-size: 18px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    padding: 0 15px;
  }

  /* 移动端保持原始大小 */
  .key-scene {
    width: 280px;
    height: 280px;
  }

  .key-wrapper {
    transform: scale(1);
  }
}

@media (max-width: 480px) {
  .primary-button,
  .secondary-button {
    padding: 12px 20px !important;
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

.progress-section-wrapper.pinned-wrapper {
  height: 90px; /* 固定时的高度 */
}

.progress-section {
  padding: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  top: 0;
  box-sizing: border-box;
}

.progress-section.pinned {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 999;
  border-top: 2px solid #BA955C;
  top: var(--navbar-height);
  box-sizing: border-box;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  padding: 15px 20px;
  position: relative;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
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
  width: clamp(40px, 8vw, 60px);
  height: clamp(40px, 8vw, 60px);
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(14px, 2.5vw, 18px);
  color: #666;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  cursor: pointer;
  text-align: center;
  line-height: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #ffffff;
  font-weight: 600;
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
}

.progress-bar .step.completed {
  background: linear-gradient(135deg, #2A3535 0%, #4a5555 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(42, 53, 53, 0.4);
  border-color: #ffffff;
}

.progress-bar .step:hover:not(.active):not(.completed) {
  transform: scale(1.05);
  background: linear-gradient(135deg, #d4b68c 0%, #BA955C 100%);
  color: white;
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
    margin: 15px 0;
    padding: 12px 15px;
  }

  .progress-bar::before {
    height: 5px;
  }

  .progress-bar .step {
    width: 45px;
    height: 45px;
    font-size: clamp(12px, 2vw, 16px);
  }

  .progress-section.pinned {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .progress-bar {
    margin: 10px 0;
    padding: 10px;
  }

  .progress-bar::before {
    height: 4px;
  }

  .progress-bar .step {
    width: 35px !important;
    height: 35px !important;
    font-size: 10px !important;
  }

  .progress-section.pinned {
    padding: 0;
  }

  .hero-title {
    font-size: 28px !important;
  }

  .feature-title {
    font-size: 20px !important;
  }
}

/* 添加闪动边框效果 */
.feature-card:not(.active)::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(90deg, #BA955C, #2A3535, #BA955C);
  background-size: 300% 300%;
  z-index: -1;
  animation: borderAnimation 3s ease infinite;
  opacity: 0.7;
}

@keyframes borderAnimation {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.feature-card:not(.active)::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: linear-gradient(135deg, #ffffff, #f9f9f9);
  border-radius: 14px;
  z-index: -1;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(186, 149, 92, 0.15);
  border-color: rgba(186, 149, 92, 0.3);
}

.feature-card.active {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(186, 149, 92, 0.15);
  border-color: rgba(186, 149, 92, 0.3);
}

.feature-card.active::before {
  animation: none;
  opacity: 0;
}

.feature-card::after {
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
  margin-top: 20px;
  padding: 20px;
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
  font-size: var(--font-size-sm);
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
  .feature-card:not(.active)::before {
    animation-duration: 2s;
  }

  .feature-card {
    padding: 25px 20px !important;
  }

  .feature-tip {
    padding: 12px;
  }

  .tip-content {
    font-size: var(--font-size-xs);
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
  width: 18px;
  height: 18px;
  accent-color: #BA955C;
  margin-top: 2px;
  cursor: pointer;
}

.must-see-full-width {
  width: 100%;
  margin: 40px 0;
  box-sizing: border-box;
}

.must-see-banner {
  width: 100%;
  max-height: 300px;
  height: auto;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(186, 149, 92, 0.15);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.must-see-banner:hover {
  transform: scale(1.02);
  box-shadow: 0 15px 40px rgba(186, 149, 92, 0.25);
}

/* 响应式高度调整 */
@media (max-width: 768px) {
  .must-see-full-width {
    margin: 30px 0;
  }

  .must-see-banner {
    max-height: 250px;
    height: auto;
  }
}

@media (max-width: 480px) {
  .must-see-full-width {
    margin: 25px 0;
  }

  .must-see-banner {
    max-height: 200px;
    height: auto;
  }
}

/* 新手必看部分 */
.checklist-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 40px 0;
  box-sizing: border-box;
  width: 100%;
  padding: 0 15px;
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

/* 桌面端布局 */
.checklist-container {
  display: flex;
  min-height: 400px;
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
  padding: 30px;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

/* 桌面端常见问题 */
.faq-container {
  display: flex;
  min-height: 400px;
}

.faq-container .info-content {
  flex: 1;
  padding: 30px;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.faq-container .info-image {
  flex: 1;
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

/* 移动端常见问题 */
.model-faq-container {
  display: none;
  flex-direction: column;
  box-sizing: border-box;
}

/* 图像区域 */
.info-image {
  height: 100%;
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
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin: 0;
  padding: 0 10px;
  box-sizing: border-box;
}

/* 内容区域 */
.info-content {
  flex: 1;
  padding: 30px;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  flex: 1;
  box-sizing: border-box;
  width: 100%;
}

.checklist-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
  padding: 12px 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

.checklist-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(186, 149, 92, 0.15);
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
  gap: 10px;
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
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
  width: 22px;
  height: 22px;
  border: 2px solid #ddd;
  border-radius: 5px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkmark::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
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
  font-size: 16px;
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
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 4px;
  margin-left: 32px;
}

/* 进度显示 */
.progress-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
  box-sizing: border-box;
  width: 100%;
}

/* 添加安全提示样式 */
.safety-tip {
  font-size: 14px;
  margin-bottom: 8px;
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
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #BA955C, #2A3535);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 14px;
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
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  box-sizing: border-box;
  width: 100%;
}

.checklist-list li,
.faq-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
}

/* 常见问题列表项 */
.faq-list li {
  padding: 12px 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
}

.faq-list li:hover {
  background: #fff9f0;
  transform: translateX(5px);
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
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
}

.model-faq-container .info-list {
  font-size: 15px;
  box-sizing: border-box;
  width: 100%;
}

.model-faq-container .faq-list li {
  padding: 10px 12px;
  margin-bottom: 10px;
  box-sizing: border-box;
  width: 100%;
}

.checklist-list input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #BA955C;
}

/* 常见问题列表项 */
.faq-list li {
  margin-bottom: 12px;
  box-sizing: border-box;
  width: 100%;
}

.model-faq-list li {
  margin-bottom: 10px;
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
    gap: 30px;
    margin: 30px 0;
    padding: 0 10px;
  }

  .checklist-container,
  .faq-container {
    flex-direction: column;
    min-height: auto;
  }

  .checklist-container .info-image-wrapper {
    width: 100%;
    height: 200px;
  }

  .checklist-container .info-image {
    position: relative;
    height: 200px;
  }

  .checklist-container .info-content,
  .faq-container .info-content,
  .model-faq-container .info-content {
    width: 100%;
  }

  .info-image {
    width: 100%;
    height: 160px;
  }

  .info-title {
    font-size: 20px;
    padding: 15px;
  }

  .info-content {
    padding: 20px;
  }

  .info-list {
    font-size: 15px;
  }

  .info-list li {
    margin-bottom: 10px;
  }

  .checkbox-label {
    gap: 10px;
  }

  .checkbox-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin-top: 3px;
  }

  .faq-list li {
    padding: 10px;
    margin-bottom: 10px;
  }

  .checklist-list,
  .faq-list {
    font-size: 14px;
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
    padding: 10px 12px;
    margin-bottom: 12px;
  }

  .check-text {
    font-size: 15px;
  }

  .item-icon {
    width: 60%;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .checklist-section {
    gap: 25px;
    margin: 25px 0;
    padding: 0 10px;
  }

  .info-image {
    height: 140px;
  }

  .info-title {
    font-size: 18px;
    padding: 10px;
  }

  .info-content {
    padding: 15px;
  }

  .info-list {
    font-size: 14px;
  }

  .info-list li {
    margin-bottom: 8px;
  }

  .checkbox-label {
    gap: 8px;
  }

  .checkbox-label input[type="checkbox"] {
    width: 15px;
    height: 15px;
    margin-top: 3px;
  }

  .faq-list li {
    padding: 8px;
    font-size: 14px;
  }

  .model-faq-container .info-image.mobile-header {
    height: 100px;
  }

  .model-faq-container .info-title {
    font-size: 18px;
  }

  .model-faq-container .info-content {
    padding: 15px;
  }

  .model-faq-container .info-list {
    font-size: 14px;
  }

  .checklist-list,
  .faq-list {
    font-size: 13px;
  }

  .checklist-container .info-image,
  .model-faq-container .info-image.mobile-header {
    height: 25vh;
    min-height: 120px;
  }

  .checklist-item {
    padding: 8px 10px;
    margin-bottom: 10px;
  }

  .check-text {
    font-size: 14px;
  }

  .item-icon {
    width: 60%;
    height: 40px;
  }

  .progress-text {
    font-size: 13px;
  }
}

@media (min-width: 769px) {
  .checklist-container,
  .faq-container {
    display: flex;
    gap: 0;
    min-height: 40vh;
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
    padding: 30px;
  }

  .faq-container .info-image {
    flex: 1;
    width: 50%;
    height: 40vh;
    aspect-ratio: 1/1;
    background-size: cover;
    background-position: center;
  }

  .faq-container .info-content {
    flex: 1;
    width: 50%;
    padding: 30px;
  }

  .info-title {
    font-size: 32px;
    padding: 20px;
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
    height: 160px;
  }
}

.more-section {
  width: 100%;
  height: 25vh;
  box-sizing: border-box;
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
  padding: 20px;
  box-sizing: border-box;
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .more-section {
    height: 25vh;
    min-height: 150px;
  }

  .more-content {
    font-size: var(--font-size-lg);
    padding: 15px;
  }

  .large-title {
    font-size: 24px !important;
    padding: 15px;
  }

  .large-text,
  .more-content {
    font-size: 32px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .more-section {
    height: 25vh;
    min-height: 120px;
  }

  .more-content {
    font-size: var(--font-size-base);
    padding: 10px;
  }

  .large-title {
    font-size: 20px !important;
    padding: 10px;
  }

  .large-text,
  .more-content {
    font-size: 18px;
    padding: 10px;
  }

}

.large-title {
  font-size: 28px !important;
  padding: 20px;
}

.large-text {
  font-size: 24px;
}

.contact-section {
  text-align: left;
  padding: 60px 80px;
  margin-top: 60px;
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
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: #2A3535;
  margin-bottom: 30px;
  line-height: 1.5;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}

.contact-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
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
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 40px;
  box-sizing: border-box;
  width: 100%;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2A3535;
  text-decoration: none;
  font-size: var(--font-size-base);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  min-width: 200px;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 8px;
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
    font-size: var(--font-size-3xl);
  }
}

@media (max-width: 992px) {
  .contact-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 40px 20px;
  }

  .contact-links {
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 30px;
  }

  .contact-link {
    width: 100%;
    max-width: 300px;
    padding: 10px 14px;
    min-width: unset;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
    padding: 6px;
  }

  .feature-card {
    padding: 25px 20px;
  }

  .progress-bar .step {
    width: 50px;
    height: 50px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .contact-section {
    padding: 25px 10px;
  }

  .contact-links {
    gap: 12px;
    margin-top: 25px;
  }

  .contact-link {
    padding: 8px 12px;
    min-width: 100%;
  }

  .icon-wrapper {
    width: 28px;
    height: 28px;
    padding: 5px;
  }

  .contact-title {
    font-size: var(--font-size-xl);
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
    padding: 80px 20px 40px;
    text-align: center;
  }

  .hero-content {
    margin-left: 0;
    padding: 0 15px;
  }

  .hero-badge {
    margin-bottom: 15px;
  }

  .badge-text {
    font-size: 12px;
    padding: 8px 16px;
  }

  .hero-title {
    font-size: 28px;
    margin: 15px 0 20px;
    line-height: 1.3;
  }

  .gradient-text {
    font-size: 14px;
    line-height: 1.4;
  }

  .hero-actions {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    max-width: 280px;
    padding: 12px 20px;
    font-size: 16px;
  }

  .hero-visual {
    margin-top: 30px;
    justify-content: center;
  }

  .visual-container {
    width: 280px;
    height: 280px;
  }

  .key-scene {
    width: 280px;
    height: 280px;
  }

  .key-wrapper {
    transform: scale(1);
  }

  .features-section {
    padding: 50px 0 30px;
  }

  .section-header {
    margin-bottom: 40px;
    padding: 0 15px;
  }

  .section-header h2 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 15px;
  }

  .feature-card {
    padding: 25px 20px;
    border-radius: 12px;
  }

  .feature-card:nth-child(n) {
    grid-column: 1 !important;
    grid-row: auto !important;
  }

  .feature-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .feature-description {
    font-size: 15px;
  }

  .feature-tip {
    padding: 15px;
    margin-top: 15px;
  }

  .tip-content {
    font-size: 14px;
  }

  .feature-image-right {
    width: 80px;
    margin-top: 10px;
  }

  .progress-section {
    padding: 0 10px;
  }

  .progress-section.pinned {
    top: var(--navbar-height);
    padding: 0 10px;
  }

  .progress-bar {
    margin: 15px 0;
    padding: 10px 15px;
  }

  .progress-bar .step {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .progress-bar::before {
    height: 4px;
  }

  .checklist-section {
    gap: 30px;
    margin: 30px 0;
  }

  .info-card {
    border-radius: 12px;
  }

  .checklist-container,
  .faq-container,
  .model-faq-container {
    border-radius: 12px;
  }

  .info-content {
    padding: 20px 15px;
  }

  .info-title {
    font-size: 22px;
  }

  .checklist-item {
    padding: 10px;
    margin-bottom: 12px;
    gap: 10px;
  }

  .check-text {
    font-size: 15px;
  }

  .item-icon {
    width: 60%;
    height: 80px;
  }

  .progress-summary {
    margin-top: 15px;
    padding-top: 15px;
  }

  .safety-tip {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .progress-text {
    font-size: 13px;
  }

  .faq-list li {
    padding: 10px;
    margin-bottom: 10px;
    font-size: 15px;
  }

  .contact-section {
    padding: 40px 20px;
    margin-top: 40px;
  }

  .contact-title {
    font-size: 24px;
    margin-bottom: 25px;
    text-align: left;
    width: 100%;
  }

  .contact-links {
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }

  .contact-link {
    width: 100%;
    max-width: 300px;
    padding: 10px 15px;
    min-width: 250px;
    font-size: 15px;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 70px 15px 30px;
  }

  .hero-title {
    font-size: 24px;
  }

  .gradient-text {
    font-size: 13px;
  }

  .primary-button,
  .secondary-button {
    padding: 10px 16px;
    font-size: 15px;
    max-width: 240px;
  }

  .visual-container,
  .key-scene {
    width: 240px;
    height: 240px;
  }

  .features-section {
    padding: 40px 0 20px;
  }

  .section-header h2 {
    font-size: 22px;
  }

  .feature-card {
    padding: 20px 15px;
  }

  .feature-title {
    font-size: 18px;
  }

  .feature-description {
    font-size: 14px;
  }

  .feature-tip {
    padding: 12px;
  }

  .tip-content {
    font-size: 13px;
  }

  .feature-image-right {
    width: 70px;
  }

  .progress-bar {
    margin: 12px 0;
    padding: 8px 10px;
  }

  .progress-bar .step {
    width: 35px;
    height: 35px;
    font-size: 12px;
  }

  .progress-bar::before {
    height: 3px;
  }

  .checklist-section {
    gap: 25px;
    margin: 25px 0;
  }

  .info-content {
    padding: 15px 12px;
  }

  .info-title {
    font-size: 20px;
  }

  .checklist-item {
    padding: 8px;
    margin-bottom: 10px;
    gap: 8px;
  }

  .check-text {
    font-size: 14px;
  }

  .item-icon {
    width: 60%;
    height: 40px;
  }

  .faq-list li {
    padding: 8px;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .progress-text {
    font-size: 12px;
  }

  .safety-tip {
    font-size: 12px;
  }

  .contact-section {
    padding: 30px 15px;
    margin-top: 30px;
  }

  .contact-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .contact-links {
    gap: 12px;
    margin-top: 25px;
  }

  .contact-link {
    padding: 8px 12px;
    min-width: 220px;
    font-size: 14px;
  }

  .icon-wrapper {
    width: 28px;
    height: 28px;
    padding: 5px;
  }
}
</style>
