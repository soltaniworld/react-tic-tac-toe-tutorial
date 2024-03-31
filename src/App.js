import React from "react";
import { useState } from "react";

function Square({value, onSquareClick}) {
  // const [value, setValue] = useState(null);

  return <button 
    className="square"
    onClick={onSquareClick}
    >
      {value}
    </button>;
}


function Board({ xIsNext, squares, onPlay }){
  const winner = calculateWinner(squares);
  let status;

  if (winner){
    status = "Winner: " + winner;
  }
  else{
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  
  function handleClick(i) {
    if(squares[i] || calculateWinner(squares)){
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else{
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
 
  }

  function createBoard(squares) {
    const rows = [];
    // iterate through each row and push row as a list item to rows
    for (let row = 0; row < 3; row++) {
      const columns = [];
      // iterate through each column and push column Square as a list item to columns
      for (let col = 0 + row*3; col  < 3 + row*3; col++) {
        columns.push(
          <Square
            key={col}
            className="board-row"
            value={squares[col]}
            onSquareClick={() => handleClick(col)}
          />
        );
      }
      rows.push(
        <div key={row} className="board-row">
          {columns}
        </div>
      );
    }
    return rows;
  }
  return(
    <>
    <div className="status">{status}</div>
      <div className="board-row">
      {createBoard(squares)}
      </div>
    </>
  )
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const newHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move)=>{
    let description;
    let style = {color: 'red'};
    
    if (move > 0){
      description = 'Go to move #' + move;
    }
    else{
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button 
          style={move === currentMove ? style : null}  
          onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}