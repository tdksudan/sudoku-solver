class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) return {error: 'Required field missing'};
    if (puzzleString.length !== 81) return {error: 'Expected puzzle to be 81 characters long'};
    if (/[^1-9]/.test(puzzleString)) return {error: 'Invalid characters in puzzle'};
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

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

