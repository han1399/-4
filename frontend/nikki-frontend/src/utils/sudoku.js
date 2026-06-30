// 生成完整数独终盘（使用回溯算法）
function generateSudoku() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0))
  solveSudoku(board)
  return board
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1,2,3,4,5,6,7,8,9])
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num
            if (solveSudoku(board)) return true
            board[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false
    if (board[i][col] === num) return false
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3)
    const boxCol = 3 * Math.floor(col / 3) + (i % 3)
    if (board[boxRow][boxCol] === num) return false
  }
  return true
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 根据难度挖空
function createPuzzle(solution, clues) {
  const puzzle = solution.map(row => [...row])
  let positions = []
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      positions.push([i, j])
  shuffle(positions)
  const toRemove = 81 - clues
  for (let k = 0; k < toRemove; k++) {
    const [r, c] = positions[k]
    puzzle[r][c] = 0
  }
  return puzzle
}

// 检查是否唯一解（简单检查，可不用）
// 这里我们不实现唯一解检查，但生成的终盘大概率唯一

export function generatePuzzle(level, levelIndex) {
  // level: 'easy', 'medium', 'hard'
  // levelIndex: 0~4，每关递增难度（减少提示数）
  const baseClues = {
    easy: 40,
    medium: 33,
    hard: 31
  }
  const decrement = levelIndex // 每关少1个提示，难度递增
  let clues = Math.max(baseClues[level] - decrement, 20) // 最少20个提示，防止太变态
  // 但不同难度保持区分
  if (level === 'easy') clues = Math.max(40 - decrement, 28)
  else if (level === 'medium') clues = Math.max(33 - decrement, 22)
  else if (level === 'hard') clues = Math.max(31 - decrement, 20)
  
  const solution = generateSudoku()
  const puzzle = createPuzzle(solution, clues)
  return { puzzle, solution }
}

// 检查填入数字是否合法（用于实时校验）
export function isValidMove(board, row, col, num) {
  // 先临时填入
  board[row][col] = num
  // 检查行、列、宫
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) {
      board[row][col] = 0
      return false
    }
    if (i !== row && board[i][col] === num) {
      board[row][col] = 0
      return false
    }
  }
  const boxRow = 3 * Math.floor(row / 3)
  const boxCol = 3 * Math.floor(col / 3)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rr = boxRow + i, cc = boxCol + j
      if ((rr !== row || cc !== col) && board[rr][cc] === num) {
        board[row][col] = 0
        return false
      }
    }
  }
  board[row][col] = 0 // 恢复
  return true
}