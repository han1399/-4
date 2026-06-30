<template>
  <div class="task-overlay" @click.self="close">
    <div class="task-popup">
      <h3>📋 每日任务</h3>
      <div class="task-item">
        <input type="checkbox" :checked="task1Status === 2" disabled />
        <label>购买一件衣服</label>
        <button @click="claimTask(1)" :disabled="task1Status !== 1">
          领取奖励
        </button>
        <span v-if="task1Status === 2">✅ 已领取</span>
      </div>
      <div class="task-item">
        <input type="checkbox" :checked="task2Status === 2" disabled />
        <label>完成一次高分搭配（≥80分）</label>
        <button @click="claimTask(2)" :disabled="task2Status !== 1">
          领取奖励
        </button>
        <span v-if="task2Status === 2">✅ 已领取</span>
      </div>
      <button class="close-btn" @click="close">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['close'])
const userStore = useUserStore()

// 任务状态
const task1Status = computed(() => userStore.tasks.task1.status)
const task2Status = computed(() => userStore.tasks.task2.status)

// 领取奖励
const claimTask = (taskId) => {
  const reward = 3000
  const success = userStore.claimTaskReward(`task${taskId}`, reward)
  if (success) {
    alert(`任务 ${taskId} 奖励领取成功！获得 💰${reward} 金币`)
  } else {
    alert('任务尚未完成或已领取')
  }
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.task-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.task-popup {
  background: #fff;
  border-radius: 20px;
  padding: 30px 40px;
  min-width: 380px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: popIn 0.3s ease;
}

.task-popup h3 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.task-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #ff9a9e;
}

.task-item label {
  flex: 1;
  font-size: 15px;
}

.task-item button {
  padding: 4px 14px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.task-item button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.task-item span {
  font-size: 13px;
  color: #4caf50;
}

.close-btn {
  display: block;
  margin: 20px auto 0;
  padding: 8px 30px;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
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