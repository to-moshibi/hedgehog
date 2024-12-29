import { INVALID_MOVE } from 'boardgame.io/core';

let loserFlag = null
function IsVictory(cells, playerID) {
  //左上から走査するので、右・下向きだけでOK
  if(loserFlag !=null && loserFlag != playerID){
    console.log("loserFlag")
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
      if (i % 8 > 3 && i < 40) {
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
  } else if(loser[0]) {
    return true
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
export function IsInvalidMove(cell, id, playerID, turn) {
  if (turn == 1) {
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

export const TicTacToe = {
  setup: () => ({ cells: Array(64).fill(null) }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    clickCell: ({ G, ctx, playerID }, id) => {

      if (IsInvalidMove(G.cells, id, playerID, ctx.turn)) {
        return INVALID_MOVE
      }
      G.cells[id] = playerID;
      MovePieces(G.cells, id, playerID)

    },
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
      let moves = [];
      for (let i = 0; i < 64; i++) {
        if (IsInvalidMove(G.cells, i, ctx.currentPlayer, ctx.turn) != true) {
          moves.push({ move: 'clickCell', args: [i] });
        }
      }
      return moves;
    }
  }
};