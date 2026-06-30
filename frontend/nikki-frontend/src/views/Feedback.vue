<template>
  <div class="feedback-page">
    <FeedbackTransition v-if="showTransition" @done="showTransition = false" />

    <header class="feedback-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>📝 意见反馈</h2>
    </header>

    <div class="feedback-body">
      <!-- 表单区域 -->
      <div class="form-area">
        <h3>✍️ 留下你的jio印</h3>
        <div class="form-group">
          <label>日期</label>
          <input type="date" v-model="formDate" />
        </div>
        <div class="form-group">
          <label>反馈内容</label>
          <textarea v-model="formContent" rows="4" placeholder="请详细描述你的建议或问题..."></textarea>
        </div>
        <button class="submit-btn" @click="submitFeedback">
          {{ isEditing ? '更新反馈' : '提交反馈' }}
        </button>
        <button v-if="isEditing" class="cancel-btn" @click="cancelEdit">取消编辑</button>
      </div>

      <!-- 反馈列表 -->
      <div class="list-area">
        <h3>📋 已提交的反馈（{{ feedbackList.length }}/6）</h3>
        <div v-if="feedbackList.length === 0" class="empty-tip">
          还没有反馈，来写下你的第一条吧！
        </div>
        <div v-else class="feedback-list">
          <div v-for="(item, index) in feedbackList" :key="index" class="feedback-item">
            <div class="feedback-meta">
              <span class="feedback-date">{{ item.date }}</span>
              <div class="feedback-actions">
                <button class="edit-btn" @click="editFeedback(index)">✏️</button>
                <button class="delete-btn" @click="requestDelete(index)">🗑️</button>
              </div>
            </div>
            <div class="feedback-content">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 普通弹窗 -->
    <Popup
      v-if="showPopup"
      :title="popupTitle"
      :message="popupMessage"
      icon="🌸"
      @close="showPopup = false"
    />

    <!-- 确认弹窗 -->
    <ConfirmPopup
      v-if="showConfirm"
      title="删除反馈"
      message="确定要删除这条反馈吗？删除后作者概不负责哦～"
      @confirm="confirmDelete"
      @close="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Popup from '@/components/Popup.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import FeedbackTransition from '@/components/FeedbackTransition.vue'

const router = useRouter()

// 过渡控制
const showTransition = ref(true)

// 普通弹窗
const showPopup = ref(false)
const popupTitle = ref('')
const popupMessage = ref('')

// 确认弹窗
const showConfirm = ref(false)
const pendingDeleteIndex = ref(-1)   // 待删除的索引

// 表单数据
const formDate = ref('')
const formContent = ref('')
const isEditing = ref(false)
const editIndex = ref(-1)

// 反馈列表
const feedbackList = ref([])

// 加载本地存储
const loadFeedback = () => {
  const stored = localStorage.getItem('feedbackList')
  if (stored) {
    try {
      feedbackList.value = JSON.parse(stored)
    } catch (e) {
      feedbackList.value = []
    }
  } else {
    feedbackList.value = []
  }
}

// 保存到本地存储
const saveFeedback = () => {
  localStorage.setItem('feedbackList', JSON.stringify(feedbackList.value))
}

// 提交或更新反馈
const submitFeedback = () => {
  if (!formContent.value.trim()) {
    showPopup.value = true
    popupTitle.value = '提示'
    popupMessage.value = '请填写反馈内容哦～'
    return
  }

  if (!isEditing.value && feedbackList.value.length >= 6) {
    showPopup.value = true
    popupTitle.value = '提示'
    popupMessage.value = '最多只能保留6条反馈，请删除一些再添加吧'
    return
  }

  const date = formDate.value || new Date().toISOString().slice(0, 10)

  if (isEditing.value) {
    feedbackList.value[editIndex.value] = {
      date: date,
      content: formContent.value.trim()
    }
    isEditing.value = false
    editIndex.value = -1
    showPopup.value = true
    popupTitle.value = '🌸 反馈更新成功！'
    popupMessage.value = '你的建议已更新，感谢你的支持～'
  } else {
    feedbackList.value.push({
      date: date,
      content: formContent.value.trim()
    })
    showPopup.value = true
    popupTitle.value = '🌸 反馈成功！'
    popupMessage.value = '谢谢你的宝贵意见，我们会认真阅读～'
  }

  saveFeedback()
  formDate.value = ''
  formContent.value = ''
}

// 编辑反馈
const editFeedback = (index) => {
  const item = feedbackList.value[index]
  formDate.value = item.date
  formContent.value = item.content
  isEditing.value = true
  editIndex.value = index
  document.querySelector('.form-area').scrollIntoView({ behavior: 'smooth' })
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  editIndex.value = -1
  formDate.value = ''
  formContent.value = ''
}

// 请求删除（弹出确认窗）
const requestDelete = (index) => {
  pendingDeleteIndex.value = index
  showConfirm.value = true
}

// 确认删除
const confirmDelete = () => {
  const index = pendingDeleteIndex.value
  if (index >= 0 && index < feedbackList.value.length) {
    feedbackList.value.splice(index, 1)
    saveFeedback()
    // 如果正在编辑的条目被删除，取消编辑状态
    if (isEditing.value && editIndex.value === index) {
      cancelEdit()
    } else if (isEditing.value && editIndex.value > index) {
      editIndex.value -= 1
    }
  }
  pendingDeleteIndex.value = -1
}

// 返回首页
const goBack = () => {
  router.push('/')
}

onMounted(() => {
  loadFeedback()
  const today = new Date().toISOString().slice(0, 10)
  formDate.value = today
})
</script>

<style scoped>
/* 样式与之前完全相同，此处省略... */
.feedback-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url('/images/p5.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.3);
}
.feedback-header h2 {
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
.feedback-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  overflow-y: auto;
}
.form-area {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.form-area h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-size: 20px;
}
.form-group {
  margin-bottom: 14px;
}
.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
}
.form-group input[type="date"],
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 15px;
  background: #fff;
  transition: border-color 0.2s;
  outline: none;
  box-sizing: border-box;
}
.form-group input[type="date"]:focus,
.form-group textarea:focus {
  border-color: #b6a6dd;
}
.form-group textarea {
  resize: vertical;
  min-height: 80px;
}
.submit-btn {
  padding: 10px 30px;
  background: #b6a6dd;
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-right: 12px;
}
.submit-btn:hover {
  background: #a08fc9;
}
.submit-btn:active {
  transform: scale(0.97);
}
.cancel-btn {
  padding: 10px 24px;
  background: #ccc;
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #bbb;
}
.list-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  overflow-y: auto;
  min-height: 200px;
}
.list-area h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-size: 20px;
}
.empty-tip {
  color: #aaa;
  text-align: center;
  padding: 30px 0;
  font-size: 16px;
}
.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.feedback-item {
  background: #f9f7fc;
  border-radius: 12px;
  padding: 12px 16px;
  border-left: 4px solid #b6a6dd;
}
.feedback-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.feedback-date {
  font-size: 13px;
  color: #888;
}
.feedback-actions {
  display: flex;
  gap: 6px;
}
.feedback-actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
  transition: transform 0.1s;
}
.feedback-actions button:hover {
  transform: scale(1.15);
}
.edit-btn {
  color: #6c8cff;
}
.delete-btn {
  color: #ff6b6b;
}
.feedback-content {
  font-size: 15px;
  color: #333;
  word-break: break-word;
  white-space: pre-wrap;
}
@media (max-width: 600px) {
  .feedback-body {
    padding: 12px;
  }
  .form-area, .list-area {
    padding: 16px;
  }
}
</style>