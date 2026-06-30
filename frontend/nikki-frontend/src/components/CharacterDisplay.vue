<template>
  <div class="character-wrapper">
    <div class="character-container">
      
      <!-- 1. 最底层：身体基底（穿任何衣服时隐藏，避免穿模） -->
      <img 
        v-if="!currentHair && !currentTop && !currentBottom && !currentShoes && !currentSuit && !currentSkirt"
        src="/images/show.png" 
        class="layer base-layer" 
        alt="身体基底"
      />

      <!-- 2. 鞋子层（z-index: 1） -->
      <img 
        v-if="currentShoes"
        :src="currentShoes.imageUrl"
        class="layer"
        style="z-index: 1"
        alt="鞋子"
      />

      <!-- 3. 下装层（z-index: 2） -->
      <img 
        v-if="currentBottom && !currentSuit && !currentSkirt"
        :src="currentBottom.imageUrl"
        class="layer"
        style="z-index: 2"
        alt="下装"
      />

      <!-- 4. 上装层（z-index: 3） -->
      <img 
        v-if="currentTop && !currentSuit && !currentSkirt"
        :src="currentTop.imageUrl"
        class="layer"
        style="z-index: 3"
        alt="上装"
      />

      <!-- 5. 套装层（z-index: 3，替代上装+下装） -->
      <img 
        v-if="currentSuit"
        :src="currentSuit.imageUrl"
        class="layer"
        style="z-index: 3"
        alt="套装"
      />

      <!-- 6. 裙子层（z-index: 3，替代上装+下装） -->
      <img 
        v-if="currentSkirt"
        :src="currentSkirt.imageUrl"
        class="layer"
        style="z-index: 3"
        alt="裙子"
      />

      <!-- 7. 头发层（z-index: 4） -->
      <img 
        v-if="currentHair"
        :src="currentHair.imageUrl"
        class="layer"
        style="z-index: 4"
        alt="头发"
      />

      <!-- 8. 妆容层（z-index: 5，最高层） -->
      <img 
        v-if="outfitStore.makeup && currentMakeup"
        :src="currentMakeup.imageUrl"
        class="layer"
        style="z-index: 5"
        alt="妆容"
      />

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrentOutfitStore } from '@/stores/currentOutfit'
import { useWardrobeStore } from '@/stores/wardrobe'

const outfitStore = useCurrentOutfitStore()
const wardrobeStore = useWardrobeStore()

// 使用计算属性确保响应式更新
const currentHair = computed(() => {
  if (!outfitStore.hair) return null
  return wardrobeStore.items.find(item => item.id === outfitStore.hair)
})

const currentTop = computed(() => {
  if (!outfitStore.top) return null
  return wardrobeStore.items.find(item => item.id === outfitStore.top)
})

const currentBottom = computed(() => {
  if (!outfitStore.bottom) return null
  return wardrobeStore.items.find(item => item.id === outfitStore.bottom)
})

const currentShoes = computed(() => {
  if (!outfitStore.shoes) return null
  return wardrobeStore.items.find(item => item.id === outfitStore.shoes)
})

const currentSuit = computed(() => {
  if (!outfitStore.suit) return null
  return wardrobeStore.items.find(item => item.id === outfitStore.suit)
})

const currentSkirt = computed(() => {
  if (!outfitStore.skirt) return null
  return wardrobeStore.items.find(item => item.id === outfitStore.skirt)
})

const currentMakeup = computed(() => {
  if (!outfitStore.makeup) return null
  return wardrobeStore.items.find(item => item.id === outfitStore.makeup)
})
</script>

<style scoped>
.character-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.character-container {
  position: relative;  /* ← 关键：添加相对定位作为子元素定位参考 */
  width: 100%;
  max-width: 400px;   /* 可调，防止过大 */
  height: 100%;
  max-height: 500px;  /* 可调 */
  aspect-ratio: 3 / 4; /* 保持比例，适应图片 */
  background: transparent;  /* ← 重点：背景变透明 */
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持比例，如果图片尺寸不一致 */
  pointer-events: none; /* 让点击穿透，不干扰点击事件 */
}

.base-layer {
  z-index: 0;
}
</style>