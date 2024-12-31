import { cellHistory, getWinner, IsDraw, PossibleMoves, MovePieces } from "./Game";

class HedgehogState {
    constructor(cells, playerID) {
        this.cells = cells
        this.playerID = playerID
        this.moves = this.getPossibleMoves()
    }
    getPossibleMoves() {
        return PossibleMoves(this.cells, this.playerID).map(cell => {
            return cell.args
        })
    }

    applyMove(move) {
        const newCells = this.cells.slice();
        MovePieces(newCells, move, this.playerID)
        return new HedgehogState(newCells, this.playerID === 0 ? 1 : 0)
    }

    isTerminal() {
        return getWinner(this.cells, this.playerID) !== false || IsDraw(this.cells)
    }

    getWinner() {
        return getWinner(this.cells, this.playerID)
    }

    getResult(player) {
        const winner = this.getWinner();
        if (winner == player) {
            return 1;
        };
        if (winner == 1 - player){
            return 0;
        };
        return 0.5;
    }

    equals(otherState) {
        return this.cells.every((cell, index) => cell === otherState.cells[index]);
    }

    clone() {
        return new HedgehogState(this.cells.slice(), this.playerID);
    }
}

function force(promise) {
    try {
        const result = promise;
        return result;
    } catch (error) {
        console.error('Error in force function:', error);
        throw error;
    }
}

function createNode(gameTreePromise, parentNode, move) {
    const gameTree = force(gameTreePromise);
    return new Node(gameTree, parentNode, move);
}

function Node(gameTree, parentNode, move) {
    this.gameTree = gameTree;
    this.parentNode = parentNode;
    this.move = move;
    this.childNodes = [];
    this.wins = 0;
    this.visits = 0;
    this.untriedMoves = gameTree.moves.slice();
}

Node.prototype.selectChild = function () {
    var totalVisits = this.visits;
    var values = this.childNodes.map(function (n) {
        var c = Math.sqrt(2);
        return n.wins / n.visits +
            c * Math.sqrt(Math.log(totalVisits) / n.visits);
    });
    return this.childNodes[values.indexOf(Math.max.apply(null, values))];
};

Node.prototype.expandChild = function () {
    var i = getRandomInt(this.untriedMoves.length);
    var move = this.untriedMoves.splice(i, 1)[0][0];
    var child = createNode(force(this.gameTree.applyMove(move)), this, move);
    this.childNodes.push(child);
    return child;
};

Node.prototype.simulate = function (player) {
    var gameTree = this.gameTree;
    while (gameTree.moves.length != 0) {
        var i = getRandomInt(gameTree.moves.length);
        gameTree = force(gameTree.applyMove(gameTree.moves[i]));
    }
    return gameTree.getResult(player);
};

Node.prototype.backpropagate = function (result) {
    for (var node = this; node != null; node = node.parentNode) {
        node.update(result);
    }
};

Node.prototype.update = function (won) {
    this.wins += won;
    this.visits += 1;
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function tryMonteCarloTreeSearch(rootGameTree, maxTries) {
    var rootNode = createNode(rootGameTree, null, null);
    for (var i = 0; i < maxTries; i++) {
        var node = rootNode;
        while (node.untriedMoves.length == 0 && node.childNodes.length != 0) {
            
            node = node.selectChild();
        }
        if (node.untriedMoves.length != 0) {
            node = node.expandChild();
        }
        var result = node.simulate(rootNode.gameTree.playerID);
        node.backpropagate(result);
    }
    return rootNode.selectChild().move;
}

export async function getMCTSMove(playerID, maxTries) {
    const gameTree = new HedgehogState(cellHistory[cellHistory.length-1], playerID);
    return await tryMonteCarloTreeSearch(gameTree, maxTries);
}