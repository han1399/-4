<template>
  <div class="trade-page">
    <!-- 过渡动画 -->
    <TradeTransition v-if="showTransition" @done="showTransition = false" />

    <!-- 弹窗 -->
    <Popup
      v-if="showPopup"
      :title="popupTitle"
      :message="popupMessage"
      icon="💰"
      @close="showPopup = false"
    />

    <header class="trade-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>💰 交易中心</h2>
      <span class="gold-display">💰 {{ userStore.gold }}</span>
    </header>

    <div class="trade-body">
      <div class="preview-area">
        <div v-if="selectedCloth" class="preview-content">
          <img :src="selectedCloth.imageUrl" alt="预览" />
          <div class="preview-info">
            <h3>{{ selectedCloth.name }}</h3>
            <p>拥有数量：{{ selectedCloth.quantity }}</p>
            <p>售价：💰 {{ selectedCloth.price }} / 件</p>
            <div class="sell-control">
              <button @click="adjustQty(-1)">−</button>
              <span>{{ sellQuantity }}</span>
              <button @click="adjustQty(1)">+</button>
              <span class="max-hint">（最多可卖 {{ maxSell }} 件）</span>
            </div>
            <button class="sell-btn" @click="confirmSell" :disabled="sellQuantity <= 0">
              卖出 💰 {{ sellQuantity * selectedCloth.price }}
            </button>
          </div>
        </div>
        <div v-else class="empty-preview">
          👈 请从下方选择要卖的衣服
        </div>
      </div>

      <div class="list-area">
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="selectCategory(cat.value)"
            :class="{ active: selectedCategory === cat.value }"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="clothes-grid">
          <div
            v-for="item in filteredClothes"
            :key="item.id"
            class="cloth-item"
            @click="selectCloth(item)"
            :class="{ selected: selectedCloth && selectedCloth.id === item.id }"
          >
            <img :src="item.imageUrl" alt="衣服" />
            <span>{{ item.name }}</span>
            <span class="qty">×{{ item.quantity }}</span>
          </div>
          <div v-if="filteredClothes.length === 0" class="empty-tip">
            该分类暂无衣服可卖
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useWardrobeStore } from '@/stores/wardrobe'
import Popup from '@/components/Popup.vue'
import TradeTransition from '@/components/TradeTransition.vue'   // 引入过渡组件

// 弹窗相关
const showPopup = ref(false)
const popupTitle = ref('')
const popupMessage = ref('')

// 过渡相关
const showTransition = ref(true)   // 进入页面时显示过渡

const router = useRouter()
const userStore = useUserStore()
const wardrobeStore = useWardrobeStore()

const categories = [
  { label: '全部', value: 'all' },
  { label: '裙子', value: 'skirt' },
  { label: '套装', value: 'suit' },
  { label: '上衣', value: 'top' },
  { label: '下装', value: 'bottom' },
  { label: '鞋子', value: 'shoes' },
  { label: '头发', value: 'hair' }
]

const selectedCategory = ref('all')
const selectedCloth = ref(null)
const sellQuantity = ref(0)

// 从 store 读取数据
const filteredClothes = computed(() => {
  return wardrobeStore.items.filter(item => {
    if (selectedCategory.value !== 'all' && item.category !== selectedCategory.value) {
      return false
    }
    return item.quantity > 0
  })
})

const maxSell = computed(() => {
  if (!selectedCloth.value) return 0
  return selectedCloth.value.quantity
})

const selectCategory = (cat) => {
  selectedCategory.value = cat
  selectedCloth.value = null
  sellQuantity.value = 0
}

const selectCloth = (item) => {
  if (selectedCloth.value && selectedCloth.value.id === item.id) {
    selectedCloth.value = null
    sellQuantity.value = 0
  } else {
    selectedCloth.value = item
    sellQuantity.value = 0
  }
}

const adjustQty = (delta) => {
  const newQty = sellQuantity.value + delta
  if (newQty < 0) return
  if (newQty > maxSell.value) {
    alert(`最多只能卖 ${maxSell.value} 件`)
    return
  }
  sellQuantity.value = newQty
}

const confirmSell = () => {
  if (sellQuantity.value <= 0) {
    showPopup.value = true
    popupTitle.value = '提示'
    popupMessage.value = '请选择要卖的数量'
    return
  }
  if (!selectedCloth.value) {
    showPopup.value = true
    popupTitle.value = '提示'
    popupMessage.value = '请选择要卖的衣服'
    return
  }

  const total = sellQuantity.value * selectedCloth.value.price
  wardrobeStore.removeItem(selectedCloth.value.id, sellQuantity.value)
  userStore.updateGold(userStore.gold + total)

  showPopup.value = true
  popupTitle.value = '💰 卖出成功！'
  popupMessage.value = `获得 💰${total} 金币`

  selectedCloth.value = null
  sellQuantity.value = 0
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.trade-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f0eb;
}
.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: #b6a6dd;
  color: #fff;
  flex-shrink: 0;
}
.trade-header h2 {
  margin: 0;
}
.back-btn {
  background: rgba(255,255,255,0.25);
  border: none;
  color: #fff;
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
}
.gold-display {
  background: rgba(255,215,0,0.3);
  padding: 4px 16px;
  border-radius: 20px;
}
.trade-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
  background-image: url('/images/bg3.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  position: relative;
}
.trade-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  z-index: 0;
}
.trade-body > * {
  position: relative;
  z-index: 1;
}
.preview-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
.preview-content {
  display: flex;
  gap: 30px;
  align-items: center;
}
.preview-content img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 10px;
}
.preview-info h3 {
  margin: 0 0 8px 0;
}
.preview-info p {
  margin: 4px 0;
  font-size: 15px;
}
.sell-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}
.sell-control button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  font-size: 18px;
  cursor: pointer;
}
.sell-control span {
  font-size: 20px;
  min-width: 30px;
  text-align: center;
}
.max-hint {
  font-size: 12px;
  color: #888;
  margin-left: 8px;
}
.sell-btn {
  padding: 10px 30px;
  background: #b6a6dd;
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}
.sell-btn:hover:not(:disabled) {
  transform: scale(1.02);
}
.sell-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.empty-preview {
  color: #aaa;
  font-size: 20px;
}
.list-area {
  flex: 2;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}
.category-tabs button {
  padding: 4px 14px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.category-tabs button.active {
  background: #b6a6dd;
  color: #fff;
}
.clothes-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  overflow-y: auto;
  align-content: start;
}
.cloth-item {
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.cloth-item:hover {
  border-color: #4facfe;
  transform: scale(1.03);
}
.cloth-item.selected {
  border-color: #4facfe;
  background: #e8f4ff;
}
.cloth-item img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}
.cloth-item span {
  display: block;
  font-size: 12px;
  margin-top: 4px;
}
.cloth-item .qty {
  font-size: 11px;
  color: #888;
}
.empty-tip {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  color: #aaa;
}
</style>