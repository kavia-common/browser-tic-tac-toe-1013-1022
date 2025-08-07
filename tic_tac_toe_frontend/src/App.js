import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Color palette (from request):
 *   Primary:   #2563eb (X)
 *   Secondary: #e5e7eb (O/bg)
 *   Accent:    #f59e42 (highlight/winner)
 * Theme: light, minimalistic
 * Layout: Centered, status on top, controls below.
 */

// Square for board, minimal presentational component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' ttt-square-highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Square: ${value}` : 'Empty Square'}
      tabIndex={0}
      type="button"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Board is array of 9 cells, each '', 'X', or 'O'
  const [board, setBoard] = useState(Array(9).fill(''));
  // True: X's turn; False: O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // String: 'X', 'O', 'Draw', or null if game ongoing
  const [winner, setWinner] = useState(null);
  // If win detected, contains winning indices for highlight
  const [winningLine, setWinningLine] = useState([]);

  // PUBLIC_INTERFACE
  // Returns an array [winnerMark, indices] or [null, []]
  function calculateWinner(squares) {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // cols
      [0,4,8], [2,4,6],          // diags
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] && 
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return [squares[a], line];
      }
    }
    return [null, []];
  }

  // PUBLIC_INTERFACE
  // Handles click on a square
  function handleSquareClick(idx) {
    // If game over or non-empty cell, do nothing
    if (board[idx] || winner) return;
    const boardCopy = board.slice();
    boardCopy[idx] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
    // Check after move (done in useEffect)
  }

  // PUBLIC_INTERFACE
  // Reset game state
  function handleReset() {
    setBoard(Array(9).fill(''));
    setXIsNext(true);
    setWinner(null);
    setWinningLine([]);
  }

  // Check after board updates for win/draw
  useEffect(() => {
    const [win, line] = calculateWinner(board);
    if (win) {
      setWinner(win);
      setWinningLine(line);
    } else if (board.every(cell => cell)) {
      setWinner('Draw');
      setWinningLine([]);
    } else {
      setWinner(null);
      setWinningLine([]);
    }
  }, [board]);

  // Status message
  let status;
  if (winner) {
    status = winner === 'Draw'
      ? "It's a draw!"
      : `Winner: ${winner === 'X' ? '❌ X' : '⭕ O'}`;
  } else {
    status = `Next turn: ${xIsNext ? '❌ X' : '⭕ O'}`;
  }

  return (
    <div className="App ttt-container">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-status" data-testid="status-msg">{status}</div>

      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
        {board.map((value, idx) =>
          <Square
            key={idx}
            value={value}
            onClick={() => handleSquareClick(idx)}
            highlight={winningLine.includes(idx)}
          />
        )}
      </div>

      <div className="ttt-controls">
        <button className="ttt-reset-btn" onClick={handleReset} type="button">
          Reset Game
        </button>
      </div>
      <footer className="ttt-footer">
        <span>Made with React &middot; Minimal UI</span>
      </footer>
    </div>
  );
}

export default App;
