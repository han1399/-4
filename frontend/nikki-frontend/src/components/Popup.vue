<template>
  <div class="popup-overlay" @click.self="close">
    <div class="popup-box">
      <div class="popup-icon" v-if="icon">{{ icon }}</div>
      <h3 class="popup-title">{{ title }}</h3>
      <p class="popup-message">{{ message }}</p>
      <button class="popup-btn" @click="close">{{ btnText }}</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    default: ''
  },
  btnText: {
    type: String,
    default: '确定'
  },
  icon: {
    type: String,
    default: '✅'
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-box {
  background: #fff;
  border-radius: 24px;        /* 大圆角，四角圆钝 */
  padding: 32px 40px 28px;
  min-width: 300px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: popIn 0.3s ease;
}

.popup-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.popup-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.popup-message {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
}

.popup-btn {
  padding: 10px 40px;
  background: #9F8189;
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.popup-btn:hover {
  background: #806a72;
}

@keyframes popIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>