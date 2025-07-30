const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const samplePuzzles = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

    test('Solve a puzzle with valid puzzle string: Post/api/solve', done => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: validPuzzle })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'solution');
                assert.equal(res.body.solution, validSolution);
                done();
            });
    });

    test('Solve a puzzle with missing puzzle string: Post/api/solve', done => {
        chai.request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Required field missing' });
                done();
            });
    });

    test('Solve a puzzle with invalid chararacters: POST /api/solve', done => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5*0..A9...2.....4....35..1....76..9...3....1.....4.....7..5....2.3..6.1.5' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
                done();
            });
    });

    test('Solve a puzzle with incorrect length: POST/api/solve', done => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5..9' })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                done();
            });
    });

    test('Solve a puzzle that cannot be solved: POST/api/solve', done => {
        const invalidPuzzle = '9'.repeat(81); //filled with 9s = invalid
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: invalidPuzzle })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
                done();
            });
    });

    test('Check a puzzle placement with all fields: POST/api/check', done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: "A2",
                value: "3"
            })
            .end((err, res) => {
                assert.property(res.body, 'valid');
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test('Check a puzzle placement with single placement conflict: POST/api/check', done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A6',
                value: '4' // causes a row conflict only
            })
            .end((err, res) => {
                assert.isFalse(res.body.valid);
                assert.deepEqual(res.body.conflict, ['row']); // single conflict only
                done();
            });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST/api/check', done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A1',
                value: '2'
            })
            .end((err, res) => {
                assert.isFalse(res.body.valid);
                assert.includeMembers(res.body.conflict, ['row', 'column']);
                done();
            });
    });

    test('Check a puzzle placement with all placement conflicts: POST/api/check', done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A1',
                value: '2'
            })
            .end((err, res) => {
                assert.isFalse(res.body.valid);
                assert.includeMembers(res.body.conflict, ['row', 'column', 'region']);
                done();
            });
    });

    test('Check a puzzle placement with missing required fields: POST /api/check', done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                value: '5'
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                done();
            });
    });

    test('Check a puzzle placement with invalid characters: POST /api/check', done => {
        const invalidPuzzle = validPuzzle.slice(0, 10) + '*' + validPuzzle.slice(11);
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: invalidPuzzle,
                coordinate: '82',
                value: '4'
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                done();
            });
    });

    test('Check a puzzle placement with incorrect length: POST /api/check', done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..9',
                coordinate: 'A1',
                value: '2'
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
                done();
            });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST /api/check', done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'Z9',
                value: '3'
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid coordinate' });
                done();
            });
    });

    test('Check a puzzle placement with invalid placement value: POST/api/check', done => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'B3',
                value: '12'
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid value' });
                done();
            });
    });

});

