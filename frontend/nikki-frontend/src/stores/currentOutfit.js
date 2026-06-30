import { defineStore } from 'pinia'

export const useCurrentOutfitStore = defineStore('currentOutfit', {
  state: () => ({
    hair: null,
    top: null,
    bottom: null,
    shoes: null,
    suit: null,
    skirt: null
  }),
  actions: {
    // 穿戴服装（全局互斥：一次只能穿一件）
    wear(clothing) {
      const { id, type, isSuit } = clothing

      // 如果点击的是同一件且已穿戴 → 脱下所有
      if (this.isWearing(clothing)) {
        this.clearAll()
        return
      }

      // 清空所有字段（无论什么类型）
      this.clearAll()

      // 设置当前穿着的这件
      if (isSuit) {
        if (type === 'skirt') {
          this.skirt = id
        } else {
          this.suit = id
        }
      } else {
        switch (type) {
          case 'hair':
            this.hair = id
            break
          case 'top':
            this.top = id
            break
          case 'bottom':
            this.bottom = id
            break
          case 'shoes':
            this.shoes = id
            break
          default:
            console.warn('未知类型:', type, clothing)
        }
      }
    },

    // 脱下指定服装（因为全局互斥，脱下即清空所有）
    takeOff(clothing) {
      this.clearAll()
    },

    // 判断是否穿着某件衣服
    isWearing(clothing) {
      const { id, type, isSuit } = clothing
      if (isSuit) {
        if (type === 'skirt') {
          return this.skirt === id
        } else {
          return this.suit === id
        }
      } else {
        switch (type) {
          case 'hair':
            return this.hair === id
          case 'top':
            return this.top === id
          case 'bottom':
            return this.bottom === id
          case 'shoes':
            return this.shoes === id
          default:
            return false
        }
      }
    },

    // 清空所有穿戴
    clearAll() {
      this.hair = null
      this.top = null
      this.bottom = null
      this.shoes = null
      this.suit = null
      this.skirt = null
    }
  }
})