<template>
  <div class="game-page">
    <GameTransition v-if="showTransition" @done="showTransition = false" />

    <header class="game-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>🎮 游戏中心</h2>
    </header>

    <div class="game-body">
      <div class="game-menu">
        <button class="game-btn" @click="goToSudoku">🧩 数独游戏</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GameTransition from '@/components/GameTransition.vue'

const router = useRouter()
const route = useRoute()
const showTransition = ref(true)

onMounted(() => {
  // 如果路由参数包含 noTransition，则不显示过渡动画
  if (route.query.noTransition === 'true') {
    showTransition.value = false
    // 清除 URL 参数，防止刷新页面时再次生效
    router.replace({ query: {} })
  }
})

const goBack = () => {
  router.push('/')
}

const goToSudoku = () => {
  router.push('/sudoku')
}
</script>

<style scoped>
/* 样式不变 */
.game-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url('/images/bg4.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.3);
}
.game-header h2 {
  margin: 0;
  color: #333;
  font-size: 22px;
}
.back-btn {
  background: rgba(0,0,0,0.08);
  border: none;
  color: #333;
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}
.back-btn:hover {
  background: rgba(0,0,0,0.15);
}

.game-body {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-menu {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.game-btn {
  padding: 18px 50px;
  font-size: 24px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  color: #333;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 240px;
}
.game-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
</style>