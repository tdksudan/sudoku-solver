const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
   
    const validPuzzle = samplePuzzles.puzzlesAndSolution[0].puzzle;
    const validSolution = samplePuzzles.puzzlesAndSolutions[0].solution;

    test('Solve a puzzle with valid puzzle string: Post/api/solve',done=>{
        chai.request(server)
           .post('/api/solve')
           .send({puzzle: validPuzzle})
           .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.property(res.body, 'solution');
            asssert.equal(res.body.solution, validSolution);
            done();
           });
    });

    test('Solve a puzzle with missing puzzle string: Post/api/solve', done =>{
        chai.request(server)
            . post('/api/solve')
            .send({})
            .end((err, res)=>{
                assert.deepEqual(res.body, {error: 'Required field missing'});
                done();
            });
    });

    test('Solve a puzzle with invalid chararacters: POST /api/solve', done=>{
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle:'1.5*0..A9...2.....4....35..1....76..9...3....1.....4.....7..5....2.3..6.1.5'})
            .end((err, res) => {
                assert.deepEqual(res.body, {error: "Invalid characters in puzzle"});
                done();
            });
    });

    test('Solve a puzzle with incorrect length: POST/api/solve', done => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5..9'})
            .end((err, res)=>{
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long'});
                done();
            });
    });

    test('Solve a puzzle that cannot be solved: POST/api/solve', done=> {
        const invalidPuzzle = '9'.repeat(81); //filled with 9s = invalid
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: invalidPuzzle})
            .end((err, res) => {
                assert.deepEqual(res.body, { error: "Puzzle cannot be solved"});
                done();
            });
    });

    test('Check a puzzle placement with all fields: POST/api/check', done=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: "A2",
                value: "3"
            })
            .end((err, res) =>{
                assert.property(res.body, 'valid');
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST/api/check',done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle:validPuzzle, 
                coordinate: 'A1',
                value: '5'
            })
            .end((err, res) => {
                assert.isFalse(res.body.valid);
                assert.includeMembers(res.body.conflict, ['row', 'column']);
                done();
            });
    });

    test('Check a puzzle placement with all placement conflicts: POST/api/check', done=>{
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A1',
                value: validPuzzle[0]
            })
            .end((err, res)=>{
                assert.isFalse(res.body.valid);
                assert.includeMembers(res.body.conflict, ['row', 'column', 'region']);
                done();
            });
    });
});

