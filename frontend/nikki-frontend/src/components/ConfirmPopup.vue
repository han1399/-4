<template>
  <div class="confirm-overlay" @click.self="close">
    <div class="confirm-box">
      <div class="confirm-icon">🤔</div>
      <h3 class="confirm-title">{{ title }}</h3>
      <p class="confirm-message">{{ message }}</p>
      <div class="confirm-buttons">
        <button class="confirm-btn cancel" @click="close">取消</button>
        <button class="confirm-btn ok" @click="confirm">确认</button>
      </div>
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
    default: '确定要执行此操作吗？'
  }
})

const emit = defineEmits(['confirm', 'close'])

const confirm = () => {
  emit('confirm')
  emit('close')
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.confirm-box {
  background: #fff;
  border-radius: 24px;
  padding: 32px 40px 28px;
  min-width: 280px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: popIn 0.3s ease;
}
.confirm-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
.confirm-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}
.confirm-message {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px 0;
}
.confirm-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.confirm-btn {
  padding: 10px 32px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.confirm-btn.cancel {
  background: #e0e0e0;
  color: #555;
}
.confirm-btn.cancel:hover {
  background: #d0d0d0;
}
.confirm-btn.ok {
  background: #ff6b6b;
  color: #fff;
}
.confirm-btn.ok:hover {
  background: #e55555;
}
.confirm-btn:active {
  transform: scale(0.96);
}
@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>