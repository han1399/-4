<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// 没有任何逻辑，只用于路由出口
</script>

<style>
/* 1. 引入 Google Fonts 中的可爱字体 */
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap');

/* 2. 全局重置与字体设置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'ZCOOL KuaiLe', 'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif;
  min-height: 100vh;
  background: #f5f0eb;
}

/* 让所有按钮、输入框、标签都继承这个可爱字体 */
button, input, textarea, select, label, span, div, p, h1, h2, h3, h4, h5, h6 {
  font-family: inherit;
}

* 全局滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.04);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #d5c6e8;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #b6a6dd;
}
</style>