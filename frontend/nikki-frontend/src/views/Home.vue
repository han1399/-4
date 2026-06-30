<template>
  <div class="home">
    <header class="header">
      <!-- 左侧区域：标题 + 头像 -->
      <div class="header-left">
        <h1 class="logo">✨ Nikki 换装</h1>
        <img
          :src="currentAvatar"
          class="avatar-circle"
          :style="{ backgroundImage: 'url(' + currentAvatar + ')' }"
          title="点击切换头像"
          @click="openAvatarModal"
        />
      </div>

      <!-- 右侧用户信息 -->
      <div class="user-info">
        <span>大厅：莹澈心曲</span>
        <span>👤 {{ userStore.username }}</span>
        <span class="gold">💰 {{ userStore.gold }}</span>
        <button class="task-btn-header" @click="showTask = true">📋 任务</button>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </header>

    <div class="main-content">
      <div class="character-area">
        <div class="score-panel">
          <h4>📊 搭配评分</h4>
          <div class="score-display">
            <span class="score-number">{{ score }}</span>
            <span class="score-label">分</span>
          </div>
          <div class="score-rules">
            <p class="rule-title">评分规则：</p>
            <ul>
              <li>只穿上衣或下装 → &lt; 80 分</li>
              <li>其他搭配 → 80 ~ 100 分</li>
            </ul>
          </div>
          <div class="score-tip" v-if="score < 80 && score > 0">
            💡 尝试多搭配几件衣服吧！
          </div>
          <div class="score-tip high" v-else-if="score >= 80">
            ✨ 很棒的搭配！
          </div>
          <div class="score-tip" v-else>
            👗 点击下方按钮开始评分
          </div>
          <button class="score-btn" @click="calculateScore">⭐ 开始评分</button>
        </div>

        <div class="character-right">
          <CharacterDisplay />
          <div class="action-buttons">
            <button class="action-btn shop" @click="goToShop">🛒 商城</button>
            <button class="action-btn trade" @click="goToTrade">💰 交易</button>
            <button class="action-btn feedback" @click="goToFeedback">📝 反馈</button>
            <button class="action-btn game" @click="goToGame">🎮 游戏</button>
          </div>
        </div>
      </div>

      <div class="wardrobe-area">
        <WardrobePanel />
      </div>
    </div>

    <TaskPopup v-if="showTask" @close="showTask = false" />

    <!-- 头像切换弹窗 -->
    <div v-if="showAvatarModal" class="modal-overlay" @click.self="closeAvatarModal">
      <div class="modal-content">
        <h3>选择头像</h3>
        <div class="avatar-grid">
          <div
            v-for="(img, index) in avatarList"
            :key="index"
            class="avatar-option"
            :class="{ selected: tempSelected === img }"
            @click="selectAvatar(img)"
          >
            <img :src="img" alt="头像" />
          </div>
        </div>
        <div class="modal-actions">
          <button class="modal-btn confirm" @click="confirmAvatar">确认</button>
          <button class="modal-btn cancel" @click="closeAvatarModal">退出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCurrentOutfitStore } from '@/stores/currentOutfit'
import CharacterDisplay from '@/components/CharacterDisplay.vue'
import WardrobePanel from '@/components/WardrobePanel.vue'
import TaskPopup from '@/components/TaskPopup.vue'

const router = useRouter()
const userStore = useUserStore()
const outfitStore = useCurrentOutfitStore()

const showTask = ref(false)
const score = ref(0)

// ----- 头像切换相关 -----
const avatarList = [
  '/images/head1.png',
  '/images/head2.png',
  '/images/head3.png'
]
const currentAvatar = ref(localStorage.getItem('avatar') || avatarList[0])
const showAvatarModal = ref(false)
const tempSelected = ref(currentAvatar.value)

// 打开弹窗
const openAvatarModal = () => {
  tempSelected.value = currentAvatar.value
  showAvatarModal.value = true
}

// 关闭弹窗（不保存）
const closeAvatarModal = () => {
  showAvatarModal.value = false
}

// 选择头像（仅临时选中）
const selectAvatar = (img) => {
  tempSelected.value = img
}

// 确认并保存
const confirmAvatar = () => {
  currentAvatar.value = tempSelected.value
  localStorage.setItem('avatar', currentAvatar.value)
  showAvatarModal.value = false
}

// 页面加载时读取存储的头像
onMounted(() => {
  const saved = localStorage.getItem('avatar')
  if (saved) {
    currentAvatar.value = saved
  }
})

// ----- 原有评分逻辑 -----
const calculateScore = () => {
  const { hair, top, bottom, shoes, suit, skirt } = outfitStore
  
  const hasTop = !!top
  const hasBottom = !!bottom
  const hasSuit = !!suit
  const hasSkirt = !!skirt
  const hasHair = !!hair
  const hasShoes = !!shoes

  let newScore = 0

  if (hasSuit || hasSkirt) {
    newScore = Math.floor(Math.random() * 21) + 80
  } else {
    const onlyTop = hasTop && !hasBottom && !hasSuit && !hasSkirt
    const onlyBottom = hasBottom && !hasTop && !hasSuit && !hasSkirt

    if (onlyTop || onlyBottom) {
      newScore = Math.floor(Math.random() * 20) + 60
    } else {
      const totalClothes = (hasTop ? 1 : 0) + (hasBottom ? 1 : 0) + 
                           (hasSuit ? 1 : 0) + (hasSkirt ? 1 : 0) + 
                           (hasHair ? 1 : 0) + (hasShoes ? 1 : 0)
      if (totalClothes === 0) {
        newScore = 0
      } else {
        newScore = Math.floor(Math.random() * 21) + 80
      }
    }
  }

  score.value = newScore

  if (newScore >= 80 && userStore.tasks.task2.status === 0) {
    userStore.updateTask('task2', 1)
    alert('🎉 恭喜！完成一次高分搭配！请到任务面板领取奖励。')
  }
}

watch(
  () => [outfitStore.hair, outfitStore.top, outfitStore.bottom, outfitStore.shoes, outfitStore.suit, outfitStore.skirt],
  (newVal) => {
    const allNull = newVal.every(v => v === null)
    if (allNull) {
      score.value = 0
    }
  }
)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const goToShop = () => router.push('/shop')
const goToTrade = () => router.push('/trade')
const goToFeedback = () => router.push('/feedback')
const goToGame = () => {router.push('/game')}
</script>

<style scoped>
/* ===== 原有样式保持不变 ===== */
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f0eb;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: #FB7DA8;
  flex-shrink: 0;
}
.logo {
  font-size: 24px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  margin: 0;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #fff;
  font-size: 16px;
}
.gold {
  background: rgba(255,215,0,0.3);
  padding: 4px 16px;
  border-radius: 20px;
}
.logout-btn {
  background: rgba(255,255,255,0.25);
  border: none;
  color: #fff;
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
}
.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
}
.character-area {
  flex: 6;
  display: flex;
  gap: 20px;
  background-image: url('/images/bg1.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}
.character-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  z-index: 0;
}
.character-area > * {
  position: relative;
  z-index: 1;
}
.score-panel {
  width: 180px;
  flex-shrink: 0;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.score-panel h4 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #333;
}
.score-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 16px;
}
.score-number {
  font-size: 48px;
  font-weight: bold;
  color: #4facfe;
}
.score-label {
  font-size: 18px;
  color: #888;
}
.score-rules {
  width: 100%;
  text-align: left;
  font-size: 13px;
  color: #555;
  margin-bottom: 12px;
}
.score-rules .rule-title {
  font-weight: bold;
  margin: 0 0 6px 0;
}
.score-rules ul {
  margin: 0;
  padding-left: 18px;
}
.score-rules li {
  margin: 4px 0;
}
.score-tip {
  font-size: 14px;
  color: #888;
  margin-top: 8px;
  padding: 6px 12px;
  background: #fff;
  border-radius: 20px;
  width: 100%;
}
.score-tip.high {
  color: #f5576c;
  background: #fff0f0;
}
/* 顶部任务按钮 */
.task-btn-header {
  background: rgba(255, 255, 255, 0.25);
  border: none;
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.task-btn-header:hover {
  background: rgba(255, 255, 255, 0.4);
}

.score-btn {
  margin-top: 12px;
  padding: 8px 24px;
  background:#C3F0D3; 
  border: none;
  border-radius: 50px;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}
.score-btn:hover {
  transform: scale(1.05);
  background: #b0e0c4;  
}
.character-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
}
.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.action-btn {
  padding: 10px 28px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  transition: transform 0.2s;
}
.action-btn:hover {
  transform: translateY(-2px);
}
.action-btn.task { background: #eb9faa;  }
.action-btn.shop { background: #f7d2d5;   }
.action-btn.trade { background: #fceff0; }
.action-btn.feedback {background: #c0cee4;}
.action-btn.game {background: #d7eae7; }

.wardrobe-area {
  flex: 4;
  background-image: url('/images/bg1.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}
.wardrobe-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  z-index: 0;
}
.wardrobe-area > * {
  position: relative;
  z-index: 1;
}

/* ===== 新增头像样式 ===== */
.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: border-color 0.2s, transform 0.2s;
  flex-shrink: 0;          /* 防止挤压变形 */
}
.avatar-circle:hover {
  border-color: #ffffff;
  transform: scale(1.05);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 24px;
  padding: 32px 40px 28px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
}
.modal-content h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
}
.avatar-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 28px;
}
.avatar-option {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #ddd;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
  background: #f5f5f5; /* 浅色背景衬托透明头像 */
}
.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-option:hover {
  transform: scale(1.05);
}
.avatar-option.selected {
  border-color: #FB7DA8;
  box-shadow: 0 0 0 4px rgba(251, 125, 168, 0.3);
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.modal-btn {
  padding: 10px 32px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.modal-btn.confirm {
  background: #FB7DA8;
  color: #fff;
}
.modal-btn.confirm:hover {
  background: #e96a94;
}
.modal-btn.cancel {
  background: #e0e0e0;
  color: #555;
}
.modal-btn.cancel:hover {
  background: #d0d0d0;
}
.modal-btn:active {
  transform: scale(0.96);
}
</style>