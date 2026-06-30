<template>
  <div class="wardrobe-panel">
    <div class="panel-header">
      <h3 class="panel-title">👗 我的衣柜</h3>
      <button class="clear-btn" @click="clearAll">🗑️ 清除</button>
    </div>

    <div class="search-bar">
      <input type="text" v-model="searchText" placeholder="搜索风格（云端/信鸽/苹果）" />
    </div>

    <div class="category-tabs">
      <button
        v-for="cat in categoryOptions"
        :key="cat.value"
        @click="currentCategory = cat.value"
        :class="{ active: currentCategory === cat.value }"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="clothes-grid">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="cloth-item"
        @click="wearItem(item)"
        :class="{ wearing: outfitStore.isWearing(item) }"
      >
        <img :src="item.imageUrl" alt="衣服" />
        <span>{{ item.name }}</span>
        <span v-if="item.quantity > 1" class="quantity">×{{ item.quantity }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCurrentOutfitStore } from '@/stores/currentOutfit'
import { useWardrobeStore } from '@/stores/wardrobe'

const outfitStore = useCurrentOutfitStore()
const wardrobeStore = useWardrobeStore()

const categoryOptions = [
  { label: '全部', value: 'all' },
  { label: '头发', value: 'hair' },
  { label: '裙子', value: 'skirt' },
  { label: '上衣', value: 'top' },
  { label: '下装', value: 'bottom' },
  { label: '鞋子', value: 'shoes' },
  { label: '套装', value: 'suit' }
]

const currentCategory = ref('all')
const searchText = ref('')

// 直接从 store 读取数据（删除本地的 wardrobeItems）
const filteredItems = computed(() => {
  return wardrobeStore.items.filter(item => {
    if (currentCategory.value !== 'all' && item.category !== currentCategory.value) {
      return false
    }
    if (searchText.value && !item.style.includes(searchText.value)) {
      return false
    }
    return true
  })
})

const wearItem = (item) => {
  console.log('点击穿衣:', item)
  outfitStore.wear(item)
}

const clearAll = () => {
  outfitStore.clearAll()
}
</script>

<style scoped>
.wardrobe-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.panel-title {
  font-size: 20px;
  color: #333;
  margin: 0;
}
.clear-btn {
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.clear-btn:hover {
  background: #e55555;
}
.search-bar input {
  width: 100%;
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 12px;
  outline: none;
}
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
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
  background: #ff9a9e;
  color: #fff;
  border-color: #ff9a9e;
}
.clothes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  overflow-y: auto;
  flex: 1;
}
.cloth-item {
  background: transparent !important;   /* 容器背景透明 */
  border-color: #eee;
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.cloth-item:hover {
  background: #f9f0ec;
  border-color: #ff9a9e;
  transform: scale(1.03);
}
.cloth-item.wearing {
  border-color: #f5576c;
  background: #fff0f0;
}
.cloth-item img {
  mix-blend-mode: multiply;
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: transparent !important;   /* 图片背景透明 */
  display: block;                      /* 去掉行内空白 */
  margin: 0 auto;                     /* 居中 */
}
.cloth-item span {
  display: block;
  font-size: 12px;
  margin-top: 4px;
}
.cloth-item .quantity {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff9a9e;
  color: #fff;
  border-radius: 50%;
  padding: 0 6px;
  font-size: 11px;
}
</style>