import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    username: '',
    gold: 0,
    isLoggedIn: false,
    tasks: {
      task1: { status: 0 }, // 0未完成, 1可领奖, 2已领奖
      task2: { status: 0 }
    }
  }),
  actions: {
    login(userId, username, gold) {
      this.userId = userId
      this.username = username
      this.gold = gold
      this.isLoggedIn = true
    },
    logout() {
      this.userId = null
      this.username = ''
      this.gold = 0
      this.isLoggedIn = false
      // 退出时重置任务状态（可选）
      this.tasks.task1.status = 0
      this.tasks.task2.status = 0
    },
    updateGold(gold) {
      this.gold = gold
    },
    // 更新任务状态
    updateTask(taskId, status) {
      if (this.tasks[taskId]) {
        this.tasks[taskId].status = status
      }
    },
    // 领取任务奖励
    claimTaskReward(taskId, rewardAmount) {
      if (this.tasks[taskId] && this.tasks[taskId].status === 1) {
        this.gold += rewardAmount
        this.tasks[taskId].status = 2 // 已领取
        return true
      }
      return false
    }
  }
})