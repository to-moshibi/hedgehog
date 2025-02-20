import React from 'react';
import { useState } from 'react';
import { NextCpu } from './NextCpu';
import { resetAll, IsInvalidMove, getLastMove, pushCellHistory, getCellHistory, actualTurn, MovePieces, Record, cellHistory } from './Game';
import json from './data/tree.json'

let turn = 0;
let winRatioRecord = []
let winRatioArray = []
let stack = []


function playRecord(record, reset, moves, set_cpu_id) {
  set_cpu_id(2)
  let cell = Array(64).fill(null)

  reset()
  resetAll()
  record.forEach((id, i) => {
    MovePieces(cell, id, String(i % 2))
    pushCellHistory(cell.slice())
    moves.clickCell(id)
  })
}
function findDivergence(a1, a2) {
  var result = [], longerLength = a1.length >= a2.length ? a1.length : a2.length;
  for (let i = 0; i < longerLength; i++) {
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
    for(let i = 0; i < 64; i++){
      if(document.getElementById("cell" + i).textContent.includes("%")){
        document.getElementById("cell" + i).textContent = ""
    }
  }
    const makeCpuMove = async () => {
      if (CheckChangeTurn(actualTurn)) {

        var cellHistory = getCellHistory();
        if (cellHistory[cellHistory.length - 1] !== G.cells) {
          pushCellHistory(G.cells);
          if (ctx.currentPlayer == cpu_id) {
            //auto
            // if (true) {
            if (!ctx.gameover) {
              const move = NextCpu(cpu_id, iterations);
              //auto
              // const move = NextCpu(ctx.currentPlayer, iterations);
              moves.clickCell(move);
            } else {

            }
          }
          winRatioRecord =Record.record
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
        <button className="operation" id="record_copy" onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(Record))
          document.getElementById("record").value = JSON.stringify(Record)
          let copybutton = document.getElementById("record_copy")
          copybutton.innerHTML = "COPIED!"
          copybutton.style.backgroundColor = "green"
          setTimeout(() => {
            document.getElementById("record_copy").innerHTML = "RECORD"
            document.getElementById("record_copy").style.backgroundColor = "#464646"
          }, 2500);
        }}>RECORD</button>
      </>
    )
  } else {
    operations = (
      <>
        <button className="operation" onClick={() => {
          moves.undo()
          stack.push(winRatioRecord[winRatioRecord.length - 1])
          winRatioRecord = winRatioRecord.slice(0, winRatioRecord.length - 1)
          }}>←UNDO</button>
        <button className="operation" onClick={() => {
          moves.redo()
          winRatioRecord.push(stack[stack.length - 1])
          stack = stack.slice(0, stack.length - 1)
          }}>REDO→</button>
        <button className="operation" onClick={() => {
          window.location.reload()
        }}>RESET</button>
        <button className="operation" id="record_copy" onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(Record))
          document.getElementById("record").value = JSON.stringify(Record)
          let copybutton = document.getElementById("record_copy")
          copybutton.innerHTML = "COPIED!"
          copybutton.style.backgroundColor = "green"
          setTimeout(() => {
            document.getElementById("record_copy").innerHTML = "RECORD"
            document.getElementById("record_copy").style.backgroundColor = "#464646"
          }, 2500);
        }}>RECORD</button>
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
            <div style={cellStyle} className={`${"color" + G.cells[id]} ${getLastMove() == id ? "color_red" : ""}`} id={"cell" + id}>{G.cells[id]}</div>
          ) : (
            <button style={cellStyle} id={"cell" + id} onClick={() => {
              if (ctx.gameover) {
                return
              }
              if (IsInvalidMove(G.cells, id, ctx.currentPlayer)) {
                return
              }

              // for(let i = 0; i < 64; i++){
              //   document.getElementById("cell" + i).classList.remove("prohibitfalse")
              // }

              let newCells = G.cells.slice(0);
              MovePieces(newCells, id, ctx.currentPlayer)
              const diffIndex = findDivergence(G.cells, newCells)
              diffIndex.forEach((index) => {
                if (newCells[index] == null) {
                  document.getElementById("cell" + index).style.border = "1px solid #555"
                  document.getElementById("cell" + index).style.backgroundColor = "#1a1a1a"
                  document.getElementById("cell" + index).innerHTML = ""
                } else {
                  document.getElementById("cell" + index).style.backgroundColor = newCells[index] == 0 ? "blue" : "orange"
                  document.getElementById("cell" + index).classList.remove("prohibitfalse")
                  document.getElementById("cell" + index).innerHTML = new String(newCells[index])
                }
              })
              document.getElementById("cell" + id).style.color = "red"
              setTimeout(() => {
                onClick(id)
              }, 100);
            }} className={ctx.gameover == undefined ? "prohibit" + IsInvalidMove(G.cells, id, ctx.currentPlayer) : "prohibittrue"} ></button>
          )}
        </td>
      );


    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }


  return (
    <div>
      <label>CPU設定: </label>
      <select id="select_cpu_id" name='cpu_id' value={cpu_id} onChange={(e) => {
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
      <br></br>
      <label>棋譜：</label>
      <textarea id="record" ></textarea>
      <button id="record_import" onClick={() => {
        playRecord(JSON.parse(document.getElementById("record").value).record, reset, moves, set_cpu_id)
      }}>インポート</button>
      <div id="operation_parent">
        {operations}
      </div>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      <button id="win_ratio" onClick={() => {
        winRatioArray = CheckWinRatio(winRatioRecord)
        winRatioArray.forEach((element) => {
          document.getElementById("cell" + element.move).textContent = element.win
        })
      }}>勝率予測(β)</button>
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

function CheckWinRatio(record) {
  let result = []
  let tree = json
  for (const move in record) {
    tree = tree.children.find(child => child.move == Record.record[move])
    if (tree == undefined) {
      return
    }
  }
  if (tree == undefined) {
    return
  }
  tree.children.forEach((child) => {
    let win = ((1 - (child.wins / child.visit))*100).toFixed(1) + "%"
    result.push({ move: child.move, win: win })
  })
  return result
}

