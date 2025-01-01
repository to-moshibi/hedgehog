import { cellHistory, getWinner, IsDraw, PossibleMoves, MovePieces, actualTurn } from "./Game";
import { MCTS } from "./Mcts";

class HedgehogState {
    constructor(cells, playerID) {
        this.state = {
            cells: cells,
            playerID: playerID,
            gameOver: false,
            winner: -1,
            moves: 0
        }
    }
    getState() {
        return this.state
    }
    setState(state) {
        this.state = state
    }
    cloneState() {
        return {
            cells: this.state.cells.slice(),
            playerID: this.state.playerID,
            gameOver: this.state.gameOver,
            winner: this.state.winner,
            moves: this.state.moves
        }
    }
    moves() {
        return PossibleMoves(this.state.cells, this.state.playerID).map(cell => {
            return cell.args[0]
        })
    }
    playMove(move) {
        MovePieces(this.state.cells, move, this.state.playerID)
        this.state.playerID = 1 - this.state.playerID
        this.state.moves++
        if (getWinner(this.state.cells) != -1 || IsDraw(this.state.cells)) {
            this.state.gameOver = true
            this.state.winner = getWinner(this.state.cells)
        }

    }
    gameOver() {
        return this.state.gameOver
    }
    winner() {
        return this.state.winner
    }
}

const exp = 1.41

export function NextCpu(playerID, iters) {
    const state = new HedgehogState(cellHistory[cellHistory.length - 1], playerID)
    const mcts = new MCTS(state, playerID, iters, exp)
    const move = mcts.selectMove()
    console.log(move)
    return move
}
