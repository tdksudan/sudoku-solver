'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
       const {puzzle, coordinate, value} = req.body;

       if (!puzzle || !coordinate || !value){
         return res.json({ error: 'Required field(s) missing'});
       }

       const validation = solver.validate(puzzle);
       if (validation !== true) return res.json(validation);
       
       const rowLetter = coordinate[0];
       const colNumber = parseInt(coordinate.slice(1), 10);

       const rowMap = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8 };
       const row = rowMap[rowLetter];
       const col = colNumber - 1;

       if (row === undefined || col < 0 || col>8){
        return res.json({ error: "Invalid coordinate"});
       }
       if (!/^[1-9]$/.test(value)){
         return res.json({ error: 'Invalid value'});
       }

       const conflicts = [];
       if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
       if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts. push('column');
       if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

       if (conflicts.length > 0){
        return res.json({ valid: false, conflict: conflicts});
       }

       return res.json({ valid: true});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      const validation = solver.validate(puzzle);

      if (validation !== true) return res.json(validation);

      const solution = solver.solve(puzzle);
      if(typeof solution === "object" && solution.error){
        return res.json(solution);
      }

      return res.json({ solution });
    });
};
