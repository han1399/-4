<template>
  <div class="shop-page">
    <!-- 弹窗 -->
    <Popup
      v-if="showPopup"
      :title="popupTitle"
      :message="popupMessage"
      icon="🛍️"
      @close="showPopup = false"
    />

    <!-- 过渡动画 -->
    <ShopTransition v-if="showTransition" @done="showTransition = false" />

    <header class="shop-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>🛒 服装商城</h2>
      <span class="gold-display">💰 {{ userStore.gold }}</span>
    </header>

    <div class="shop-body">
      <div class="cart-sidebar">
        <h3>🛍️ 购物车</h3>
        <div v-if="cartItems.length === 0" class="empty-cart">购物车是空的</div>
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.imageUrl" />
          <span>{{ item.name }}</span>
          <div class="qty-control">
            <button @click="updateCart(item, -1)">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateCart(item, 1)">+</button>
          </div>
        </div>
        <div v-if="cartItems.length > 0" class="cart-total">
          <span>总计: 💰 {{ totalPrice }}</span>
          <button class="checkout-btn" @click="checkout">买单</button>
        </div>
      </div>

      <div class="shop-goods">
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="currentCategory = cat.value"
            :class="{ active: currentCategory === cat.value }"
          >
            {{ cat.label }}
          </button>
        </div>
        <div class="goods-grid">
          <div v-for="item in filteredGoods" :key="item.id" class="goods-item">
            <img :src="item.imageUrl" />
            <span class="goods-name">{{ item.name }}</span>
            <span class="goods-price">💰 {{ item.price }}</span>
            <button class="add-btn" @click="addToCart(item)">加入购物车</button>
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
import ShopTransition from '@/components/ShopTransition.vue'   // 引入过渡组件

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
const currentCategory = ref('all')

const goodsList = ref([
  { id: 7, name: '夏日熏风', type: 'suit', price: 350, imageUrl: '/images/suits/suit1.png', category: 'suit' },
  { id: 8, name: '都市地铁', type: 'suit', price: 300, imageUrl: '/images/suits/suit2.png', category: 'suit' },
  { id: 9, name: '清芳梦蕴', type: 'suit', price: 280, imageUrl: '/images/suits/suit3.png', category: 'suit' },
  // 新增裙子
  { id: 10, name: '浅蓝空', type: 'skirt', price: 320, imageUrl: '/images/skirt/skirt1.png', category: 'skirt' },
  { id: 11, name: '红浆果', type: 'skirt', price: 290, imageUrl: '/images/skirt/skirt2.png', category: 'skirt' },
  { id: 12, name: '森羊女', type: 'skirt', price: 310, imageUrl: '/images/skirt/skirt3.png', category: 'skirt' },
  // 原有上衣、下装等（注意图片路径也相应修正）
  { id: 2, name: '紫色上衣', type: 'top', price: 80, imageUrl: '/images/top/top.png', category: 'top' },
  { id: 3, name: '牛仔裤', type: 'bottom', price: 100, imageUrl: '/images/bottom/bottom.png', category: 'bottom' },
  { id: 4, name: '竹青', type: 'shoes', price: 60, imageUrl: '/images/shoes/shoes.png', category: 'shoes' },
  { id: 5, name: '卷发', type: 'hair', price: 50, imageUrl: '/images/hair/hair.png', category: 'hair' }
])

const cartItems = ref([])

const filteredGoods = computed(() => {
  if (currentCategory.value === 'all') return goodsList.value
  return goodsList.value.filter(item => item.category === currentCategory.value)
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const addToCart = (goods) => {
  const exist = cartItems.value.find(item => item.id === goods.id)
  if (exist) {
    if (exist.quantity >= 10) {
      alert('单件商品最多购买10件')
      return
    }
    exist.quantity += 1
  } else {
    cartItems.value.push({ ...goods, quantity: 1 })
  }
}

const updateCart = (item, delta) => {
  const target = cartItems.value.find(i => i.id === item.id)
  if (!target) return
  const newQty = target.quantity + delta
  if (newQty <= 0) {
    cartItems.value = cartItems.value.filter(i => i.id !== item.id)
  } else if (newQty <= 10) {
    target.quantity = newQty
  } else {
    alert('单件商品最多购买10件')
  }
}

const checkout = async () => {
  if (cartItems.value.length === 0) {
    showPopup.value = true
    popupTitle.value = '购物车是空的'
    popupMessage.value = '请先添加商品到购物车'
    return
  }
  const total = totalPrice.value
  if (total > userStore.gold) {
    showPopup.value = true
    popupTitle.value = '金币不足！'
    popupMessage.value = '你还需要 ' + (total - userStore.gold) + ' 金币'
    return
  }
  userStore.updateGold(userStore.gold - total)
  cartItems.value.forEach(item => {
    wardrobeStore.addItem(item.id, item.quantity)
  })

  let taskMsg = ''
  if (userStore.tasks.task1.status === 0) {
    userStore.updateTask('task1', 1)   // 标记为可领取
    taskMsg = ' 🎉 购物任务已完成！'
  }
  
  showPopup.value = true
  popupTitle.value = '🎉 购买成功！'
  popupMessage.value = `共花费 💰${total} 金币`

  cartItems.value = []
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
/* 你的原有样式保持不变，我不做任何改动，只添加过渡组件 */
.shop-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f0eb;
}
.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: #F3ACB6;
  color: #fff;
  flex-shrink: 0;
}
.shop-header h2 {
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
.shop-body {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
  background-image: url('/images/bg2.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  position: relative;
}
.shop-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.65);
  border-radius: 16px;
  z-index: 0;
}
.shop-body > * {
  position: relative;
  z-index: 1;
}
.cart-sidebar {
  width: 260px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.cart-sidebar h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
}
.empty-cart {
  color: #aaa;
  text-align: center;
  padding: 30px 0;
}
.cart-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.cart-item img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.cart-item span {
  flex: 1;
  font-size: 14px;
}
.qty-control {
  display: flex;
  align-items: center;
  gap: 6px;
}
.qty-control button {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #f5f5f5;
  cursor: pointer;
}
.cart-total {
  margin-top: auto;
  padding-top: 12px;
  border-top: 2px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checkout-btn {
  padding: 8px 24px;
  background: linear-gradient(180deg, #F3ACB6 0%, #e09aa4 100%);
  border-radius: 50px;
  border: none;
  outline: none;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.shop-goods {
  flex: 1;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 16px;
  overflow-y: auto;
}
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}
.category-tabs button {
  padding: 4px 14px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 13px;
}
.category-tabs button.active {
  background: #F3ACB6;
  color: #fff;
  border-color: #f093fb;
}
.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.goods-item {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  transition: box-shadow 0.2s;
}
.goods-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.goods-item img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.goods-name {
  display: block;
  font-size: 14px;
  margin: 8px 0 4px;
}
.goods-price {
  display: block;
  font-size: 16px;
  color: #f5576c;
  font-weight: bold;
}
.add-btn {
  margin-top: 8px;
  padding: 6px 16px;
  background: linear-gradient(180deg, #F3ACB6 0%, #e09aa4 100%);
  border: none;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}
.add-btn:hover {
  background: #8a6f77;
}
</style>