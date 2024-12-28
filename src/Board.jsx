import React from 'react';

export function TicTacToeBoard({ ctx, G, moves }) {
  const onClick = (id) => moves.clickCell(id);

  let loser = '';
  if (ctx.gameover) {
    loser =
      ctx.gameover.loser !== undefined ? (
        <div id="loser">loser: {ctx.gameover.loser}</div>
      ) : (
        <div id="loser">Draw!</div>
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
      cells.push(
        <td key={id}>
          {G.cells[id] ? (
            <div style={cellStyle}>{G.cells[id]}</div>
          ) : (
            <button style={cellStyle} onClick={() => onClick(id)} />
          )}
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <div>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {loser}
    </div>
  );
}