'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // 1️⃣ Validate required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // 2️⃣ Validate puzzle
      const validation = solver.validate(puzzle);
      if (validation.error) return res.json(validation);

      // 3️⃣ Validate coordinate: must be A-I and 1–9
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // 4️⃣ Validate value: must be a digit 1–9
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // 5️⃣ Extract row & column
      const row = coordinate[0].toUpperCase().charCodeAt(0) - 65; // A=0
      const col = parseInt(coordinate[1], 10) - 1;


      // 7️⃣ Run conflict checks
      // 🧼 Clear cell temporarily to avoid self-conflict
      const board = puzzle.split('');
      const index = row * 9 + col;
      const originalChar = board[index];
      board[index] = '.'; // ignore current cell for placement checks

      const boardStr = board.join('');
      const conflicts = [];

      if (!solver.checkRowPlacement(boardStr, row, col, value).valid) conflicts.push('row');
      if (!solver.checkColPlacement(boardStr, row, col, value).valid) conflicts.push('column');
      if (!solver.checkRegionPlacement(boardStr, row, col, value).valid) conflicts.push('region');

      board[index] = originalChar; // optional restore, in case you need to reuse board

      return res.json(conflicts.length
        ? { valid: false, conflict: conflicts }
        : { valid: true });


    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      console.log('Puzzle received:', req.body.puzzle);
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      const result = solver.solve(puzzle);

      return res.json(typeof result === 'string'
        ? { solution: result }
        : result
      );

    });
};
