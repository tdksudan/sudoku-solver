const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver(); 

const validPuzzle = '1.5..2.84..63.12.7.2..5..9..1....8.2.3....9..5.....1.4......6.7.8..2..1.5.....4.3.';
const invalidCharPuzzle = '1.5..2.84..63.12.7.2..5..9..1....8.2.3....9..5....A1.4......6.7.8..2..1.5.....4.3.';
const shortPuzzle = '1.5..2.84..63.12.7.2..5..9..1....8.2.3....9..5.....1.4......6.7.8';


suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', ()=>{
      const validation  = solver.validate(validPuzzle);
      assert.deepEqual(validation, {valid: true});
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', ()=>{
        const validation = solver.validate(shortPuzzle);
        assert.deepEqual(validation, {error: 'Expected puzzle to be 81 characters long'});
    });

    test('Logic handles a puzzle string that is not 81 characters in length', ()=>{
       const validation = solver.validate(shortPuzzle);
       assert.deepEqual(validation, {error: 'Expected puzzle to be 81 characters long'});
    });

    test('Logic handless a vlaid row placement',()=>{
        const result = solver.checkRowPlacement(validPuzzle, 0, 1, '7');
        assert.deepEqual(result, {valid:true});
    });

    test('Logic handles an invalid row placement', ()=>{
        const result = solver.checkRowPlacement(validPuzzle, 0, 1, "1");
        assert.deepEqual(result, {valid: false, conflict:['row']});
    });
    
    test('Logic handles a valid column placement', ()=>{
        const result = solver.checkColPlacement(validPuzzle, 0, 1, '3');
        assert.deepEqual(result, {valid:true});
    });

    test('Logic handles an invalid column placement', ()=>{
        const result = solver.checkColPlacement(validPuzzle, 0, 1, '5');
        assert.deepEqual(result, {valid: false, conflict: ['column']});
    });

    test('Logic handles a vlid region (3*3 grid) placement', () => {
        const result = solver.checkRegionPlacement(validPuzzle, 0, 1, '4');
        assert.deepEqual(result, {valid:true});
    });

    test('Logic handles an invalid region (3*3 grid) placement', () => {
        const result = solver.checkRegionPlacement(validPuzzle, 0, 1, '2');
        assert.deepEqual(result, {valid: false, conflict: ['region']});

    });

    test('Valid puzzle strings pass the solver',()=>{
        const result = solver.solve(validPuzzle);
        assert.isString (result);
        assert.equal(result.length, 81);
    });

    test('Invalid puzzle strings fail the solver', ()=>{
        const result = solver.solve(invalidCharPuzzle);
        assert.deepEqual(result, { error: 'Invalid characters in puzzle'});
    });

    test('Solver returns the expected solution for an incomplete puzzle',()=>{
        const solution = solver.solve(validPuzzle);
        assert.equal(solution, "135762984946381257728459613694517832813926745257843196389174526471295368562638479");
    });

});
