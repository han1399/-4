<template>
  <div class="login-container">
    <!-- 视频背景（自动播放、静音、循环） -->
    <video autoplay muted loop playsinline class="bg-video">
      <source src="/videos/logincolor.mp4" type="video/mp4" />
      您的浏览器不支持视频播放。
    </video>

    <!-- 半透明遮罩层（让登录框更突出） -->
    <div class="overlay"></div>

    <!-- 登录框 -->
    <div class="login-box">
      <h1 class="title">✨ Nikki 换装</h1>
      <p class="subtitle">登录以进入衣橱</p>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>用户名</label>
          <input type="text" v-model="username" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <label>密码</label>
          <input type="password" v-model="password" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="login-btn">登 录</button>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </form>
    </div>
    <!-- 过渡层 -->
    <TransitionOverlay
      v-if="showTransition"
      :username="username"
      @done="goHome"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import TransitionOverlay from '@/components/TransitionOverlay.vue'
const showTransition = ref(false)

const router = useRouter()
const userStore = useUserStore()

const username = ref('nikki')
const password = ref('123456')
const errorMsg = ref('')

const handleLogin = async () => {
  try {
    const res = await axios.post('/api/user/login', null, {
      params: { username: username.value, password: password.value }
    })
    if (res.data.success) {
      userStore.login(res.data.userId, username.value, res.data.gold)
      showTransition.value = true
    } else {
      errorMsg.value = res.data.message || '登录失败'
    }
  } catch (err) {
    errorMsg.value = '网络错误，请确保后端服务已启动'
    console.error(err)
  }
}
// 过渡动画结束后执行跳转
const goHome = () => {
  showTransition.value = false
  router.push('/')
}
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
}

/* 视频背景：铺满全屏 */
.bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 0;
}

/* 半透明遮罩层（让登录框更清晰） */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35); /* 可调整透明度 */
  z-index: 1;
}

/* 登录框在遮罩层之上 */
.login-box {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  padding: 40px 50px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 380px;
  text-align: center;
}

.title {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #888;
  margin-bottom: 30px;
}

.input-group {
  text-align: left;
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.3s;
  outline: none;
}

.input-group input:focus {
  border-color: #a6c1ee;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: #FB7DA8;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.4);
}

.error {
  color: #f5576c;
  margin-top: 12px;
  font-size: 14px;
}
</style>