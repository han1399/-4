<template>
  <div class="transition-overlay" @click.self="skip">
    <div class="transition-content" :class="{ 'slide-up': animate }">
      <img src="/images/p2.jpg" alt="商城" />
      <h2>🛒 欢迎来到商城</h2>
      <p>挑选你喜欢的衣服吧 ✨</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])
const animate = ref(false)

onMounted(() => {
  setTimeout(() => {
    animate.value = true
  }, 50)
  setTimeout(() => {
    emit('done')
  }, 1500)
})

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
  transform: translateY(100%);    /* 从下方开始 */
  opacity: 0;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.6s ease;
}

.transition-content.slide-up {
  transform: translateY(0);       /* 向上滑入到中间 */
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