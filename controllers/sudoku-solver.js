

class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) return {error: 'Required field missing'};
    if (puzzleString.length !== 81) return {error: 'Expected puzzle to be 81 characters long'};
    if (/[^1-9.]/.test(puzzleString)) return {error: 'Invalid characters in puzzle'};
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
      const index = row * 9;
      for (let i = 0; i < 9; i++){
        if(i===column) continue;
        if(puzzleString[index +i]===value) return false;
      }
      return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i<9; i++){
      if (i===row) continue;
      if(puzzleString[i*9+ column]===value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
     const startRow = Math.floor(row/3)*3;
     const startCol = Math.floor(column/3)*3;

     for(let r=0; r<3; r++) {
      for(let c =0; c<3; c++) {
        const cellRow = startRow + r;
        const cellCol = startCol + c;
        const idx = cellRow * 9 + cellCol;
        if (cellRow === row && cellCol === column)continue;
        if (puzzleString[idx] === value)return false;
      }
     }
     return true;
  }

  solve(puzzleString) {
     const board = puzzleString.split('');

     const solveRecursive = () => {
      const emptyIndex = board.indexOf('.');
      if (emptyIndex === -1) return true;

      const row = Math.floor(emptyIndex/9);
      const col = emptyIndex % 9;

      for (let num = 1; num <= 9; num++){
        const value = num.toString();
        if (
          this.checkRowPlacement(board.join(''), row, col, value) &&
          this.checkColPlacement(board.join(''), row, col, value)&&
          this.checkRegionPlacement(board.join(''), row, col, value)
        ){
          board[emptyIndex] = value;
          if (solveRecursive()) return true;
          board[emptyIndex] = '.';
        }
      }
      return false; //no valid number found
     }
     
     const isValid = this.validate(puzzleString);
     if (isValid !== true) return isValid;

     if (solveRecursive()) {
      return board.join('');
     } else{
      return {error: 'Puzzle cannot be solved'};
  }
}
}

module.exports = SudokuSolver;

