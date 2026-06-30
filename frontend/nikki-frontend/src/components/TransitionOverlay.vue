<template>
  <div class="transition-overlay" @click.self="skip">
    <div class="transition-content" :class="{ 'slide-in': animate }">
      <!-- 你可以把这里的图片换成你自己的，比如 /images/logo.png 或 /images/bg1.jpg -->
      <img src="/images/p1.jpg" alt="欢迎" />
      <h2>欢迎回来，{{ username }}！</h2>
      <p>准备开始搭配吧 ✨</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  username: String
})

const emit = defineEmits(['done'])
const animate = ref(false)

onMounted(() => {
  // 稍微延迟触发动画
  setTimeout(() => {
    animate.value = true
  }, 50)
  // 动画结束后通知父组件跳转
  setTimeout(() => {
    emit('done')
  }, 1500) // 动画持续1秒，留0.5秒停留
})

// 如果用户点击遮罩，直接跳过动画
const skip = () => {
  emit('done')
}
</script>

<style scoped>
.transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.transition-content {
  text-align: center;
  transform: translateX(100%);          /* 从右侧外开始 */
  opacity: 0;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.6s ease;
}

.transition-content.slide-in {
  transform: translateX(0);             /* 向左平移到中间 */
  opacity: 1;
}

.transition-content img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  margin-bottom: 16px;
}

.transition-content h2 {
  font-size: 28px;
  color: #333;
  margin: 8px 0 4px;
}

.transition-content p {
  font-size: 18px;
  color: #888;
}
</style>