import React from 'react';
import { useState } from 'react';
import { NextCpu } from './NextCpu';
import { IsInvalidMove, getLastMove, pushCellHistory, getCellHistory, actualTurn,getWinner } from './Game';
let turn = 0;

export function HedgehogBoard({ ctx, G, moves }) {
  const [cpu_id, set_cpu_id] = useState(1);
  const [iterations, setIterations] = useState(10000);
  const onClick = (id) => {
    moves.clickCell(id)
  };
  React.useEffect(() => {
    const makeCpuMove = async () => {
      if (CheckChangeTurn(actualTurn)) {
        var cellHistory = getCellHistory();
        if (cellHistory[cellHistory.length - 1] !== G.cells) {
          pushCellHistory(G.cells);
          if (ctx.currentPlayer == cpu_id) {
            if (!ctx.gameover) {
              const move = NextCpu(cpu_id, iterations);
              moves.clickCell(move); // CPU move
            }
          }
        }
      }
    };
    makeCpuMove();
  }, [ctx, G, moves]);

  let winner = '';
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">winner: {ctx.gameover.winner == cpu_id ? "CPU":"Player"}</div>
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
              <button style={cellStyle} id={"cell"+id} onClick={() => onClick(id)} className={"prohibit" + IsInvalidMove(G.cells, id, ctx.currentPlayer)} />
            )}
          </td>
        );
      } else {
        cells.push(
          <td key={id}>
            {G.cells[id] ? (
              <div style={cellStyle} className={"color" + G.cells[id]} >{G.cells[id]}</div>
            ) : (
              <button style={cellStyle} id={"cell"+id} onClick={() => onClick(id,this)} className={"prohibit" + IsInvalidMove(G.cells, id, ctx.currentPlayer)} />
            )}
          </td>
        );
      }

    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }
  
  return (
    <div>
      <label>CPU手番: </label>
      <select name='cpu_id' value={cpu_id} onChange={(e) => {
        set_cpu_id(e.target.value)
        if (ctx.currentPlayer == e.target.value) {
          if (!ctx.gameover) {
            const move = NextCpu(e.target.value, 10000);
            moves.clickCell(move); // CPU move
          }
        }
        }}>
        <option value={0}>先手</option>
        <option value={1}>後手</option>
      </select>
      <br></br>
      <label>反復回数: </label>
      <input type="number" value={iterations} onChange={(e) => setIterations(e.target.value)} />
      <br></br>
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