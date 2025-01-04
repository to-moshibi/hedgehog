import React from 'react';
import { useState } from 'react';
import { NextCpu } from './NextCpu';
import { IsInvalidMove, getLastMove, pushCellHistory, getCellHistory, actualTurn,MovePieces } from './Game';
let turn = 0;
function findDivergence (a1, a2) {
  var result = [], longerLength = a1.length >= a2.length ? a1.length : a2.length;
  for (let i = 0; i < longerLength; i++){
      if (a1[i] != a2[i]) {
          result.push(i);
      }
  }
  return result;
};
export function HedgehogBoard({ ctx, G, moves, reset }) {
  const [cpu_id, set_cpu_id] = useState(1);
  const [iterations, setIterations] = useState(3000);
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
              moves.clickCell(move);
            }
          }
        }
      }
    };
    makeCpuMove();
  }, [ctx, G, moves]);

  let winner = '';
  let operations = '';
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">winner: {ctx.gameover.winner == cpu_id ? "CPU" : "Player"}</div>
      ) : (
        <div id="winner">Draw!</div>
      );

      operations = (
        <>
        <button className="operation" onClick={() => {
          reset()
          moves.undo()
          }}>←UNDO</button>
        <button className="operation" onClick={() => {
          moves.redo()
          }}>REDO→</button>
        <button className="operation" onClick={() => {
          window.location.reload()
          }}>RESET</button>
        </>
      )
  }else{
    operations = (
      <>
      <button className="operation" onClick={() => moves.undo()}>←UNDO</button>
      <button className="operation" onClick={() => moves.redo()}>REDO→</button>
      <button className="operation" onClick={() => {
        window.location.reload()
        }}>RESET</button>
      </>
    )
  }

  const cellStyle = {
  };



  let tbody = [];
  for (let i = 0; i < 8; i++) {
    let cells = [];
    for (let j = 0; j < 8; j++) {
      const id = 8 * i + j;
        cells.push(
          <td key={id}>
            {G.cells[id] ? (
              <div style={cellStyle} className={`${"color" + G.cells[id]} ${getLastMove() == id ? "color_red":""}`} id={"cell"+ id}>{G.cells[id]}</div>
            ) : (
              <button style={cellStyle} id={"cell" + id} onClick={() => {
                if(ctx.gameover){
                  return
                }
                if(IsInvalidMove(G.cells, id, ctx.currentPlayer)){
                  return
                }
                
                // for(let i = 0; i < 64; i++){
                //   document.getElementById("cell" + i).classList.remove("prohibitfalse")
                // }

                let newCells = G.cells.slice(0);
                MovePieces(newCells, id, ctx.currentPlayer)
                const diffIndex = findDivergence(G.cells, newCells)
                diffIndex.forEach((index) => {
                  if(newCells[index] == null){
                    document.getElementById("cell" + index).style.border = "1px solid #555"
                    document.getElementById("cell" + index).style.backgroundColor = "#1a1a1a"
                    document.getElementById("cell" + index).innerHTML = ""
                  }else{
                    document.getElementById("cell" + index).style.backgroundColor = newCells[index] == 0 ? "blue" : "orange"
                    document.getElementById("cell" + index).classList.remove("prohibitfalse")
                    document.getElementById("cell" + index).innerHTML = new String(newCells[index])
                  }
                })
                document.getElementById("cell" + id).style.color = "red"
                setTimeout(() => {
                onClick(id)
                }, 100);
              }} className={ctx.gameover == undefined?"prohibit"+IsInvalidMove(G.cells, id, ctx.currentPlayer):"prohibittrue"} />
            )}
          </td>
        );
      

    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }
  

  return (
    <div>
      <label>CPU設定: </label>
      <select name='cpu_id' value={cpu_id} onChange={(e) => {
        set_cpu_id(e.target.value)
        if (ctx.currentPlayer == e.target.value) {
          if (!ctx.gameover) {
            const move = NextCpu(e.target.value, iterations);
            moves.clickCell(move);
          }
        }
      }}>
        <option value={0}>先手</option>
        <option value={1}>後手</option>
        <option value={2}>なし</option>
      </select>
      <br></br>
      <label>試行回数: </label>
      <input type="number" value={iterations} onChange={(e) => setIterations(e.target.value)} />
      <br></br>
      <div id="operation_parent">
      {operations}
      </div>
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