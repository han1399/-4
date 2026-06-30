<template>
  <div class="sudoku-page">
    <header class="sudoku-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>🧩 数独</h2>
      <div class="header-right">
        <span class="timer">⏱️ {{ formattedTime }}</span>
        <span class="errors">❌ {{ errors }} / 3</span>
      </div>
    </header>

    <div class="sudoku-body">
      <!-- 难度选择界面 -->
      <div v-if="showLevelSelect" class="level-select-overlay">
        <div class="level-select-box">
          <h2>选择难度</h2>
          <div class="level-buttons">
            <button class="level-btn" @click="startGame('easy')">😊 简单</button>
            <button class="level-btn" @click="startGame('medium')">🤔 普通</button>
            <button class="level-btn" @click="startGame('hard')">😈 困难</button>
          </div>
          <p class="level-desc">每级难度都有 5 关，通关后获得 500 金币奖励！</p>
          <button class="cancel-btn" @click="goBack">返回游戏中心</button>
        </div>
      </div>

      <!-- 游戏界面 -->
      <template v-if="!showLevelSelect">
        <div class="top-bar">
          <div class="level-info">
            <span class="level">{{ levelNames[level] }}</span>
            <span class="level-index">第 {{ currentLevelIndex + 1 }} / 5 关</span>
          </div>
          <div class="actions">
            <button class="note-btn" :class="{ active: noteMode }" @click="toggleNote">✏️ 笔记</button>
            <button class="reset-btn" @click="resetGame">🔄 重来</button>
          </div>
        </div>

        <div class="board-wrapper">
          <div class="board">
            <div v-for="(row, r) in displayBoard" :key="r" class="row">
              <div
                v-for="(cell, c) in row"
                :key="c"
                class="cell"
                :class="{
                  'given': isGiven(r, c),
                  'selected': selectedCell && selectedCell[0] === r && selectedCell[1] === c,
                  'highlight': selectedCell && (selectedCell[0] === r || selectedCell[1] === c || (Math.floor(selectedCell[0]/3)===Math.floor(r/3) && Math.floor(selectedCell[1]/3)===Math.floor(c/3))),
                  'same-number': selectedCell && cell !== 0 && cell === getSelectedNumber(),
                  'error': errorCells.has(`${r}-${c}`),
                  'conflict': cell !== 0 && hasConflict(r, c),
                  'border-right-bold': c === 2 || c === 5 || c === 8,
                  'border-bottom-bold': r === 2 || r === 5 || r === 8
                }"
                @click="selectCell(r, c)"
              >
                <span v-if="cell !== 0" class="number">{{ cell }}</span>
                <div v-else-if="notes[r] && notes[r][c] && notes[r][c].length" class="notes">
                  <span v-for="n in 9" :key="n" class="note-num" :class="{ 'active': notes[r][c].includes(n) }">{{ n }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="num-pad">
          <button v-for="n in 9" :key="n" class="num-btn" @click="inputNumber(n)">{{ n }}</button>
          <button class="num-btn erase" @click="eraseNumber">⌫</button>
        </div>
      </template>

      <!-- 游戏结束弹窗（改动：加入图片） -->
      <div v-if="gameOver && !showLevelSelect" class="game-over-overlay">
        <div class="game-over-box">
          <!-- 根据成功/失败显示不同图片 -->
          <img
            :src="gameWon ? '/images/t1.jpg' : '/images/t2.jpg'"
            alt="结果"
            class="result-img"
          />
          <h2>{{ gameWon ? '🎉 通关成功！' : '😵 游戏结束' }}</h2>
          <p v-if="gameWon">奖励 <strong>500</strong> 金币已发放！</p>
          <p v-else>错误次数用完了，再试一次吧</p>
          <button class="game-over-btn" @click="nextAction">{{ gameWon ? '下一关' : '重新挑战' }}</button>
          <button class="game-over-btn cancel" @click="goBack">退出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { generatePuzzle, isValidMove } from '@/utils/sudoku'

const router = useRouter()
const userStore = useUserStore()

// 状态
const showLevelSelect = ref(true)
const level = ref('easy')
const currentLevelIndex = ref(0)
const solution = ref([])
const puzzle = ref([])
const board = ref([])
const given = ref([])
const notes = ref([])
const selectedCell = ref(null)
const errors = ref(0)
const timer = ref(0)
let timerInterval = null
const noteMode = ref(false)
const gameOver = ref(false)
const gameWon = ref(false)
const errorTimers = new Map()
const errorCells = new Set()

const levelNames = { easy: '简单', medium: '普通', hard: '困难' }

const formattedTime = computed(() => {
  const mins = Math.floor(timer.value / 60)
  const secs = timer.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const displayBoard = computed(() => board.value)

// 开始游戏
function startGame(selectedLevel) {
  level.value = selectedLevel
  currentLevelIndex.value = 0
  showLevelSelect.value = false
  initLevel(selectedLevel, 0)
}

function initLevel(levelName, levelIdx) {
  const { puzzle: p, solution: s } = generatePuzzle(levelName, levelIdx)
  solution.value = s
  puzzle.value = p.map(row => [...row])
  board.value = p.map(row => [...row])
  given.value = p.map(row => row.map(v => v !== 0))
  notes.value = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []))
  selectedCell.value = null
  errors.value = 0
  gameOver.value = false
  gameWon.value = false
  timer.value = 0
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => { timer.value++ }, 1000)
  // 清理所有错误定时器和错误格子标记
  errorTimers.forEach(t => clearTimeout(t))
  errorTimers.clear()
  errorCells.clear()
}

function resetGame() {
  if (confirm('确定要重新开始当前关卡吗？')) {
    initLevel(level.value, currentLevelIndex.value)
  }
}

function selectCell(row, col) {
  if (gameOver.value) return
  selectedCell.value = [row, col]
}

function getSelectedNumber() {
  if (!selectedCell.value) return null
  const [r, c] = selectedCell.value
  return board.value[r][c]
}

function isGiven(r, c) {
  return given.value[r][c]
}

function hasConflict(r, c) {
  const num = board.value[r][c]
  if (num === 0) return false
  for (let i = 0; i < 9; i++) {
    if (i !== c && board.value[r][i] === num) return true
  }
  for (let i = 0; i < 9; i++) {
    if (i !== r && board.value[i][c] === num) return true
  }
  const br = 3 * Math.floor(r / 3), bc = 3 * Math.floor(c / 3)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rr = br + i, cc = bc + j
      if ((rr !== r || cc !== c) && board.value[rr][cc] === num) return true
    }
  }
  return false
}

function isValidCell(r, c, num) {
  return isValidMove(board.value, r, c, num)
}

function inputNumber(num) {
  if (gameOver.value || !selectedCell.value) return
  const [r, c] = selectedCell.value
  if (given.value[r][c]) return

  // 笔记模式
  if (noteMode.value) {
    const idx = notes.value[r][c].indexOf(num)
    if (idx > -1) {
      notes.value[r][c].splice(idx, 1)
    } else {
      if (notes.value[r][c].length < 4) {
        notes.value[r][c].push(num)
        notes.value[r][c].sort((a,b) => a-b)
      }
    }
    return
  }

  // 清除该格子之前的错误定时器（如果有）
  const key = `${r}-${c}`
  if (errorTimers.has(key)) {
    clearTimeout(errorTimers.get(key))
    errorTimers.delete(key)
    errorCells.delete(key)
  }

  // 如果当前格子已有数字，先清空（允许修改）
  if (board.value[r][c] !== 0) {
    board.value[r][c] = 0
  }

  // 检查是否正确
  if (num === solution.value[r][c]) {
    // 正确：填入数字
    board.value[r][c] = num
    checkWin()
  } else {
    // 错误：填入数字（会显示红色）
    board.value[r][c] = num
    errors.value++
    // 标记为错误格子
    errorCells.add(key)

    // 设置定时器，1秒后清除该错误数字
    const timer = setTimeout(() => {
      // 只有当前格子仍然是对应的错误数字时才清除
      if (board.value[r][c] === num) {
        board.value[r][c] = 0
      }
      errorCells.delete(key)
      errorTimers.delete(key)
    }, 1000)
    
    errorTimers.set(key, timer)

    // 检查是否达到3次错误
    if (errors.value >= 3) {
      gameOver.value = true
      gameWon.value = false
      clearInterval(timerInterval)
      // 清除所有错误定时器
      errorTimers.forEach(t => clearTimeout(t))
      errorTimers.clear()
      errorCells.clear()
      // 把当前错误数字也清除
      board.value[r][c] = 0
    }
  }
}

function eraseNumber() {
  if (gameOver.value || !selectedCell.value) return
  const [r, c] = selectedCell.value
  if (given.value[r][c]) return
  board.value[r][c] = 0
  notes.value[r][c] = []
  // 如果该格子有错误定时器和错误标记，清除
  const key = `${r}-${c}`
  if (errorTimers.has(key)) {
    clearTimeout(errorTimers.get(key))
    errorTimers.delete(key)
  }
  errorCells.delete(key)
}

function toggleNote() {
  noteMode.value = !noteMode.value
}

// 检查胜利（改动：移除 alert）
function checkWin() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board.value[r][c] !== solution.value[r][c]) return
    }
  }
  gameWon.value = true
  gameOver.value = true
  clearInterval(timerInterval)
  userStore.updateGold(userStore.gold + 500)
  // 不再使用 alert，因为弹窗已显示信息
}

function nextAction() {
  if (gameWon.value) {
    if (currentLevelIndex.value < 4) {
      initLevel(level.value, currentLevelIndex.value + 1)
    } else {
      alert('🎉 恭喜完成所有关卡！你已经是数独大师了！')
      goBack()
    }
  } else {
    initLevel(level.value, currentLevelIndex.value)
  }
}

// 返回游戏中心（跳过过渡动画）
function goBack() {
  if (timerInterval) clearInterval(timerInterval)
  errorTimers.forEach(t => clearTimeout(t))
  errorTimers.clear()
  errorCells.clear()
  router.push('/game?noTransition=true')
}

onMounted(() => {
  showLevelSelect.value = true
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  errorTimers.forEach(t => clearTimeout(t))
  errorTimers.clear()
  errorCells.clear()
})
</script>

<style scoped>
/* 所有样式保持不变，仅新增弹窗图片样式 */
.sudoku-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url('/images/bg4.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.sudoku-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(6px);
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.3);
}
.sudoku-header h2 {
  margin: 0;
  color: #333;
}
.back-btn {
  background: rgba(0,0,0,0.08);
  border: none;
  color: #333;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
}
.header-right {
  display: flex;
  gap: 16px;
  font-size: 16px;
  color: #333;
}

.sudoku-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px;
  overflow-y: auto;
  position: relative;
}

/* ===== 难度选择界面 ===== */
.level-select-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  border-radius: 0;
}
.level-select-box {
  background: #fff;
  border-radius: 24px;
  padding: 32px 40px 28px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.level-select-box h2 {
  margin: 0 0 20px 0;
  font-size: 28px;
  color: #333;
}
.level-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.level-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 50px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
  background: #f0f0f0;
  color: #333;
  min-width: 90px;
}
.level-btn:nth-child(1):hover { background: #b6e6b6; }
.level-btn:nth-child(2):hover { background: #f5d48a; }
.level-btn:nth-child(3):hover { background: #f5a0a0; }
.level-btn:active { transform: scale(0.95); }
.level-desc {
  margin: 16px 0 12px 0;
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}
.cancel-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 15px;
  text-decoration: underline;
  padding: 8px 12px;
}
.cancel-btn:hover {
  color: #555;
}

/* ===== 游戏顶部栏 ===== */
.top-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  margin-bottom: 12px;
}
.level-info {
  font-size: 18px;
  color: #333;
}
.level-info .level {
  font-weight: bold;
  margin-right: 10px;
}
.actions button {
  background: rgba(255,255,255,0.7);
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
}
.note-btn.active {
  background: #b6a6dd;
  color: #fff;
}

/* ===== 棋盘 ===== */
.board-wrapper {
  background: rgba(255,255,255,0.85);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  max-width: 500px;
  width: 100%;
}

.board {
  display: grid;
  grid-template-rows: repeat(9, 1fr);
  aspect-ratio: 1/1;
  width: 100%;
}
.row {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
}

/* 每个格子的默认边框 */
.cell {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  background: rgba(255,255,255,0.6);
  aspect-ratio: 1/1;
  position: relative;
}

/* 加粗右边框（用于九宫格竖线） */
.border-right-bold {
  border-right: 3px solid #444;
}

/* 加粗下边框（用于九宫格横线） */
.border-bottom-bold {
  border-bottom: 3px solid #444;
}

.cell.given {
  background: #f0f0f0;
  color: #333;
}
.cell.selected {
  background: #b6a6dd !important;
  color: #fff;
}
.cell.highlight {
  background: #e8e0f0;
}
.cell.same-number {
  background: #d5c6e8;
}
.cell.error {
  background: #ffcdd2 !important;
  color: #c62828;
}
.cell.conflict {
  background: #ffcdd2 !important;
}
.cell .number {
  font-size: 24px;
}
.cell .notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
}
.cell .note-num {
  font-size: 10px;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell .note-num.active {
  color: #333;
  font-weight: bold;
}

/* ===== 数字键盘 ===== */
.num-pad {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  max-width: 400px;
  width: 100%;
  margin-top: 16px;
}
.num-btn {
  padding: 12px 0;
  font-size: 22px;
  border: none;
  border-radius: 12px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.num-btn:active {
  transform: scale(0.95);
}
.num-btn.erase {
  background: #ffcdd2;
  color: #c62828;
}

/* ===== 游戏结束弹窗 ===== */
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.game-over-box {
  background: #fff;
  border-radius: 24px;
  padding: 32px 40px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
/* 新增弹窗图片样式 */
.game-over-box .result-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 12px;
  border-radius: 12px;
}
.game-over-box h2 {
  margin: 0 0 8px 0;
}
.game-over-box p {
  margin: 8px 0 20px 0;
  font-size: 18px;
}
.game-over-btn {
  padding: 12px 32px;
  border: none;
  border-radius: 50px;
  background: #FB7DA8;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  margin: 0 6px;
  transition: background 0.2s;
}
.game-over-btn:hover {
  background: #e96a94;
}
.game-over-btn.cancel {
  background: #ccc;
  color: #333;
}
.game-over-btn.cancel:hover {
  background: #bbb;
}
</style>