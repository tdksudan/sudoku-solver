class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' };
    if (/[^1-9.]/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const index = row * 9;
    for (let i = 0; i < 9; i++) {
      if (i === column) continue;
      if (puzzleString[index + i] === value) {
        return { valid: false, conflict: ['row'] };
      }
    }
    return { valid: true };
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (i === row) continue;
      const checkChar = puzzleString[i * 9 + column];
      if (checkChar === value) {
        return { valid: false, conflict: ['column'] };
      }
    }
    return { valid: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cellRow = startRow + r;
        const cellCol = startCol + c;
        const idx = cellRow * 9 + cellCol;
        if (cellRow === row && cellCol === column) continue;
        if (puzzleString[idx] === value) {
          return { valid: false, conflict: ['region'] };
        }
      }
    }
    return { valid: true };
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation.error) return validation;

    const board = puzzleString.split('');

    // 🔍 Logical validation for filled puzzles
    for (let i = 0; i < 81; i++) {
      const char = board[i];
      if (char === '.') continue;

      const row = Math.floor(i / 9);
      const col = i % 9;

      board[i] = '.'; // Temporarily clear to avoid self-check

      const rowCheck = this.checkRowPlacement(board.join(''), row, col, char);
      const colCheck = this.checkColPlacement(board.join(''), row, col, char);
      const regionCheck = this.checkRegionPlacement(board.join(''), row, col, char);

      board[i] = char; // Restore the cell

      if (!rowCheck.valid || !colCheck.valid || !regionCheck.valid) {
        return { error: 'Puzzle cannot be solved' };
      }
    }

    const solveRecursive = () => {
      const emptyIndex = board.indexOf('.');
      if (emptyIndex === -1) return true;

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();

        const rowCheck = this.checkRowPlacement(board.join(''), row, col, value);
        const colCheck = this.checkColPlacement(board.join(''), row, col, value);
        const regionCheck = this.checkRegionPlacement(board.join(''), row, col, value);

        if (rowCheck.valid && colCheck.valid && regionCheck.valid) {
          board[emptyIndex] = value;
          if (solveRecursive()) return true;
          board[emptyIndex] = '.';
        }
      }

      return false;
    };

    if (solveRecursive()) {
      return board.join('');
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;