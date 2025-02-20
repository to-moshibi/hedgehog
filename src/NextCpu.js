import { cellHistory, getWinner, IsDraw, PossibleMoves, MovePieces, resetLoserFlag } from "./Game";
import { MCTS } from "./Mcts";

class HedgehogState {
    constructor(cells, playerID) {
        this.state = {
            cells: cells,
            playerID: playerID,
            gameOver: false,
            winner: -1,
            moves: []
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
        let moves = PossibleMoves(this.state.cells, this.state.playerID).map(cell =>{
            return cell.args[0]
        }).filter(cell =>{
            let newCells = this.state.cells.slice()
            newCells[cell] = this.state.playerID
            return getWinner(newCells, this.state.playerID) != 1-this.state.playerID
       })
       if(moves.length == 0){
           return PossibleMoves(this.state.cells, this.state.playerID).map(cell =>{
            return cell.args[0]
        })
       }
        return moves
    }
    playMove(move) {
        resetLoserFlag()
        MovePieces(this.state.cells, move, this.state.playerID)
        this.state.playerID = 1 - this.state.playerID
        if (getWinner(this.state.cells, this.state.playerID) != -1 || IsDraw(this.state.cells)) {
            this.state.gameOver = true
            this.state.winner = getWinner(this.state.cells, this.state.playerID)
        }

        this.state.moves++

    }
    gameOver() {
        return this.state.gameOver
    }
    winner() {
        return this.state.winner
    }
}



export function NextCpu(playerID, iters) {
    const exp = 1.41
    const state = new HedgehogState(cellHistory[cellHistory.length - 1], playerID)
    const mcts = new MCTS(state, playerID, iters, exp)
    const move = mcts.selectMove()
    return move
}
