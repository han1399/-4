import { defineStore } from 'pinia'

export const useWardrobeStore = defineStore('wardrobe', {
  state: () => ({
    // 初始数据（与之前保持一致）
    items: [
    // 套装（原有）
    { id: 7, name: '夏日熏风', type: 'suit', isSuit: true, imageUrl: '/images/suits/suit1.png', style: '云端', quantity: 1, category: 'suit', price: 350 },
    { id: 8, name: '都市地铁', type: 'suit', isSuit: true, imageUrl: '/images/suits/suit2.png', style: '苹果', quantity: 1, category: 'suit', price: 300 },
    { id: 9, name: '清芳梦蕴', type: 'suit', isSuit: true, imageUrl: '/images/suits/suit3.png', style: '信鸽', quantity: 1, category: 'suit', price: 280 },

    // 裙子（你新增的）
    { id: 10, name: '浅蓝空', type: 'skirt', isSuit: true, imageUrl: '/images/skirt/skirt1.png', style: '云端', quantity: 1, category: 'skirt', price: 320 },
    { id: 11, name: '红浆果', type: 'skirt', isSuit: true, imageUrl: '/images/skirt/skirt2.png', style: '苹果', quantity: 1, category: 'skirt', price: 290 },
    { id: 12, name: '森羊女', type: 'skirt', isSuit: true, imageUrl: '/images/skirt/skirt3.png', style: '信鸽', quantity: 1, category: 'skirt', price: 310 },

    // 上衣、下装、鞋子、头发（修正图片路径）
    { id: 2, name: '紫色上衣', type: 'top', isSuit: false, imageUrl: '/images/top/top.png', style: '苹果·', quantity: 1, category: 'top', price: 80 },
    { id: 3, name: '牛仔裤', type: 'bottom', isSuit: false, imageUrl: '/images/bottom/bottom.png', style: '信鸽', quantity: 2, category: 'bottom', price: 100 },
    { id: 4, name: '竹青', type: 'shoes', isSuit: false, imageUrl: '/images/shoes/shoes.png', style: '云端', quantity: 1, category: 'shoes', price: 60 },
    { id: 5, name: '卷发', type: 'hair', isSuit: false, imageUrl: '/images/hair/hair.png', style: '苹果', quantity: 1, category: 'hair', price: 50 }
  ],
    searchStyle: '',  // 搜索风格（保留）
    currentCategory: '全部'  // 当前分类（保留）
  }),
  actions: {
    // ----- 原有方法（保持不变）-----
    setItems(items) {
      this.items = items
    },
    setCategory(category) {
      this.currentCategory = category
    },
    setSearchStyle(style) {
      this.searchStyle = style
    },
    // 获取筛选后的衣柜列表（保留）
    getFilteredItems() {
      return this.items.filter(item => {
        if (this.currentCategory !== '全部' && item.type !== this.currentCategory) {
          return false
        }
        if (this.searchStyle && item.style !== this.searchStyle) {
          return false
        }
        return true
      })
    },

    // ----- 新增方法（用于商城购买和交易）-----
    // 增加某件衣服的数量
    addItem(clothingId, amount = 1) {
      const item = this.items.find(i => i.id === clothingId)
      if (item) {
        item.quantity += amount
      } else {
        console.warn('衣服不存在，无法增加:', clothingId)
      }
    },
    // 减少某件衣服的数量（最少为0）
    removeItem(clothingId, amount = 1) {
      const item = this.items.find(i => i.id === clothingId)
      if (item) {
        const newQty = item.quantity - amount
        item.quantity = Math.max(0, newQty)
      }
    }
  }
})