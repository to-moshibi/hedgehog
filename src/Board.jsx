import React from 'react';
import { CpuMove } from './Cpu';
import { IsInvalidMove, getLastMove, pushCellHistory, getCellHistory, actualTurn } from './Game';
let turn = 0
let cpu_id = 1
export function TicTacToeBoard({ ctx, G, moves, }) {
  const onClick = (id) => moves.clickCell(id);

  if (CheckChangeTurn(actualTurn)) {
    var cellHistory = getCellHistory()
    if (cellHistory[cellHistory.length - 1] != G.cells) {
      pushCellHistory(G.cells)
    }
  }
  let winner = '';
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">winner: {ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  const cellStyle = {
    border: '1px solid #555',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
  };

  let tbody = [];
  for (let i = 0; i < 8; i++) {
    let cells = [];
    for (let j = 0; j < 8; j++) {
      const id = 8 * i + j;
      if (id == getLastMove()) {
        cells.push(
          <td key={id}>
            {G.cells[id] ? (
              <div style={cellStyle} className={"color" + G.cells[id]} id="lastmove">{G.cells[id]}</div>
            ) : (
              <button style={cellStyle} onClick={() => onClick(id)} className={"prohibit" + IsInvalidMove(G.cells, id, ctx.currentPlayer, ctx.turn)} />
            )}
          </td>
        );
      } else {
        cells.push(
          <td key={id}>
            {G.cells[id] ? (
              <div style={cellStyle} className={"color" + G.cells[id]} >{G.cells[id]}</div>
            ) : (
              <button style={cellStyle} onClick={() => onClick(id)} className={"prohibit" + IsInvalidMove(G.cells, id, ctx.currentPlayer, ctx.turn)} />
            )}
          </td>
        );
      }

    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <div>
      <button onClick={() => moves.undo()}>UNDO</button>
      <button onClick={() => moves.redo()}>REDO</button>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
    </div>
  );

  function CheckChangeTurn(actualTurn) {
    if (actualTurn != turn) {
      turn = actualTurn
      return true
    }
    return false
  }
}