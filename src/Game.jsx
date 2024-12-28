import { INVALID_MOVE } from 'boardgame.io/core';


function IsVictory(cells) {
  //左上から走査するので、右・下向きだけでOK
  for (let i = 0; i < 64; i++) {
    if (cells[i] != null) {
      //真横勝利判定
      if (i % 8 < 4) {
        if (cells[i + 1] == cells[i] && cells[i + 2] == cells[i] && cells[i + 3] == cells[i]) {
          return cells[i]
        }
      }
      //斜め右下勝利判定
      if (i % 8 < 4 && i < 40) {
        if (cells[i + 9] == cells[i] && cells[i + 18] == cells[i] && cells[i + 27] == cells[i]) {
          return cells[i]
        }
      }

      //斜め左下勝利判定
      if (i % 8 > 3 && i < 40) {
        if (cells[i + 7] == cells[i] && cells[i + 14] == cells[i] && cells[i + 21] == cells[i]) {
          return cells[i]
        }
      }
      //縦勝利判定
      if (i < 40) {
        if (cells[i + 8] == cells[i] && cells[i + 16] == cells[i] && cells[i + 24] == cells[i]) {
          return cells[i]
        }
      }
    }
  }
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
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
  if (id % 8 > 2) {
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
function IsInvalidMove(cell, id, playerID) {
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

function MovePieces(cell, id, playerID) {
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
  if (id % 8 > 2) {
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

export const TicTacToe = {
  setup: () => ({ cells: Array(64).fill(null) }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    clickCell: ({ G, ctx, playerID }, id) => {
      console.log(ctx)
      if (ctx.turn == 1) {

      } else {
        if (IsInvalidMove(G.cells, id, playerID)) {
          return INVALID_MOVE
        }
      }
      G.cells[id] = playerID;
      MovePieces(G.cells, id, playerID)

    },
  },

  endIf: ({ G, ctx }) => {
    var loser = IsVictory(G.cells)
    if (loser) {
      return { loser: loser};
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  },
};