import { INVALID_MOVE } from 'boardgame.io/core';

let loserFlag = null
let lastMove = null
export let cellHistory = [Array(64).fill(null)]
let undoNum = 0
let totalUndo = 0
export let actualTurn = 0



export function PossibleMoves(cell,currentPlayer){
  let moves = [];
  for (let i = 0; i < 64; i++) {
    if (IsInvalidMove(cell, i, currentPlayer) != true) {
      moves.push({ move: 'clickCell', args: [i] });
    }
  }
  return moves;
}

export function pushCellHistory(cell) {
  cellHistory.push(cell)
}

export function getCellHistory() {
  return cellHistory
}
export function getLastMove() {
  return lastMove
}

export function getWinner(cells, playerID) {
  if(IsVictory(cells, playerID)){
    return playerID
  }else if(loserFlag != null){
    return loserFlag === 0 ? 1 : 0
  }
  return false
}
function IsVictory(cells, playerID) {
  //左上から走査するので、右・下向きだけでOK
  if (loserFlag != null && loserFlag != playerID) {
    loserFlag = null
    return true
  }
  var loser = []
  for (let i = 0; i < 64; i++) {
    if (cells[i] != null) {
      //真横勝利判定
      if (i % 8 < 5) {
        if (cells[i + 1] == cells[i] && cells[i + 2] == cells[i] && cells[i + 3] == cells[i]) {
          loser.push(cells[i])
        }
      }
      //斜め右下勝利判定
      if (i % 8 < 5 && i < 40) {
        if (cells[i + 9] == cells[i] && cells[i + 18] == cells[i] && cells[i + 27] == cells[i]) {
          loser.push(cells[i])
        }
      }

      //斜め左下勝利判定
      if (i % 8 > 2 && i < 40) {
        if (cells[i + 7] == cells[i] && cells[i + 14] == cells[i] && cells[i + 21] == cells[i]) {
          loser.push(cells[i])
        }
      }
      //縦勝利判定
      if (i < 40) {
        if (cells[i + 8] == cells[i] && cells[i + 16] == cells[i] && cells[i + 24] == cells[i]) {
          loser.push(cells[i])
        }
      }
    }
  }
  if (loser.includes(playerID)) {
    loserFlag = playerID
    return false
  } else if (loser[0]) {
    return true
  }
}

// Return true if all `cells` are occupied.
export function IsDraw(cells) {
  return cells.filter(c => c === null).length === 0;
}

function CheckNoPlaceMoveInvalid(cell, id, playerID) {
  //上下左右のどこかに相手のコマがあれば、そこに置くことができる
  //上方向
  if (id > 7) {
    if (cell[id - 8] != null && cell[id - 8] != playerID) {
      return false
    }
  }
  //下方向
  if (id < 56) {
    if (cell[id + 8] != null && cell[id + 8] != playerID) {
      return false
    }
  }
  //左方向
  if (id % 8 > 0) {
    if (cell[id - 1] != null && cell[id - 1] != playerID) {
      return false
    }
  }
  //右方向
  if (id % 8 < 7) {
    if (cell[id + 1] != null && cell[id + 1] != playerID) {
      return false
    }
  }

  return true
}

function IsNoPlaceToPut(cell, playerID) {
  for (let i = 0; i < 64; i++) {
    if (cell[i] != null) {
      continue
    }
    if (!CheckPutInvalid(cell, i, playerID)) {
      return false
    }
  }
  return true
}

function CheckPutInvalid(cell, id, playerID) {
  //上方向
  if (id > 15) {
    if (cell[id - 8] != null && cell[id - 8] != playerID && cell[id - 16] == null) {
      return false
    }
  }
  //下方向
  if (id < 48) {
    if (cell[id + 8] != null && cell[id + 8] != playerID && cell[id + 16] == null) {
      return false
    }
  }
  //左方向
  if (id % 8 > 1) {
    if (cell[id - 1] != null && cell[id - 1] != playerID && cell[id - 2] == null) {
      return false
    }
  }
  //右方向
  if (id % 8 < 6) {
    if (cell[id + 1] != null && cell[id + 1] != playerID && cell[id + 2] == null) {
      return false
    }
  }
  return true
}
function IsCellNull(cell) {
  const isNull = (item) => item == null
  return cell.every(isNull)
}
export function IsInvalidMove(cell, id, playerID) {
  if (IsCellNull(cell)) {
    //一番外周にはおけない
    if (id < 8) {
      //上の辺
      return true
    } else if (id % 8 == 0) {
      //左の辺
      return true
    } else if (id % 8 == 7) {
      //右の辺
      return true
    } else if (id > 55) {
      //下の辺
      return true
    }
    return false
  }
  if (cell[id] != null) {
    return true
  }
  if (IsNoPlaceToPut(cell, playerID)) {
    //置く場所がないときの例外ルール
    return CheckNoPlaceMoveInvalid(cell, id, playerID)
  } else {
    return CheckPutInvalid(cell, id, playerID)
  }

}

export function MovePieces(cell, id, playerID) {
  loserFlag = null
  cell[id] = playerID;
  //上方向
  if (id > 15) {
    if (cell[id - 8] != null && cell[id - 8] != playerID && cell[id - 16] == null) {
      cell[id - 16] = cell[id - 8]
      cell[id - 8] = null
    }
  }
  //下方向
  if (id < 48) {
    if (cell[id + 8] != null && cell[id + 8] != playerID && cell[id + 16] == null) {
      cell[id + 16] = cell[id + 8]
      cell[id + 8] = null
    }
  }
  //左方向
  if (id % 8 > 1) {
    if (cell[id - 1] != null && cell[id - 1] != playerID && cell[id - 2] == null) {
      cell[id - 2] = cell[id - 1]
      cell[id - 1] = null
    }
  }
  //右方向
  if (id % 8 < 6) {
    if (cell[id + 1] != null && cell[id + 1] != playerID && cell[id + 2] == null) {
      cell[id + 2] = cell[id + 1]
      cell[id + 1] = null
    }
  }

}

export const Hedgehog = {
  setup: () => ({ cells: Array(64).fill(null) }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    clickCell: {
      move: ({ G, ctx, playerID }, id) => {

        if (IsInvalidMove(G.cells, id, playerID)) {
          return INVALID_MOVE
        }

        
        lastMove = id
        MovePieces(G.cells, id, playerID)
        if(undoNum !=0){
          cellHistory.splice(ctx.turn - (totalUndo - undoNum) * 2 - undoNum*2)
        }
        undoNum = 0
        actualTurn = ctx.turn - (totalUndo - undoNum) * 2
      },
    },
    undo: {
      move: ({ G }) => {
        loserFlag = null
        if (actualTurn - undoNum -1 < 0) {
          return INVALID_MOVE
        }
        undoNum += 1
        totalUndo += 1
        G.cells = cellHistory[Math.max(actualTurn - undoNum, 0)]
      },
    },
    redo: {
      move: ({ G }) => {
        loserFlag = null
        if (undoNum - 1 < 0) {
          return INVALID_MOVE
        }
        undoNum -= 1
        G.cells = cellHistory[Math.max(actualTurn - undoNum, 0)]
      },
    }
  },

  endIf: ({ G, ctx }) => {
    if (IsVictory(G.cells, ctx.currentPlayer)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  },
  ai: {
    enumerate: (G, ctx) => {
      return PossibleMoves(G.cells,ctx.currentPlayer)
    }
  }
};