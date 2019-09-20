const request = require('supertest')
const authModel = require('./auth-model');
const db = require('../database/dbConfig');
const server = require('../api/server');

describe('Authentication model and endpoints', () => {

    let token;

    beforeAll((done) => {
        request(server)
            .post('/login')
            .send({
                "username": "cowslip",
                "password": "password"
            })
            .end((err, response) => {
                token = response.body.token
                done();
            })
    })

    beforeEach( async () => {
        await db('users').truncate();
    })

    describe('TESTING ENVIRONMENT', () => {
        it('should set env to testing', () => {
            expect(process.env.DB_ENV).toBe('testing');
        });  
    })
    
    // REGISTER tests
    describe('REGISTER', () => {
        let data = {
            "username": "sundew",
            "password": "password"
        }
        it('POST: should send status 201 when register successful', (done) => {
            request(server)
                .post('/api/auth/register')
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        })
        it('POST: should error out if there is incomplete data sent', (done) => {
            request(server)
                .post('/api/auth/register')
                .send({"username": "hiuhiuhiuh"})
                .set('Accept', 'application/json')
                // .expect('Content-Type', /json/)
                .expect(500)
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        })
    })

    // LOGIN tests
    describe('LOGIN', () => {

        it('POST: should error out if the wrong data is sent', (done) => {
            request(server)
                .post('/api/auth/login')
                .send({"flower": "hyacinth", "password": 99})
                .set('Accept', 'application/json')
                // .expect('Content-Type', /json/)
                .expect(500)
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        })
        it('POST: should error out if there is incomplete data sent', (done) => {
            request(server)
                .post('/api/auth/login')
                .send({"username": "hiuhiuhiuh"})
                .set('Accept', 'application/json')
                // .expect('Content-Type', /json/)
                .expect(401)
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        })
    })

    // JOKES tests
    describe('JOKES', () => {
        it('GET: requires authorization', (done) => {
            request(server)
            .get('/api/jokes')
            .set('Accept', 'application/json')
            .expect({message: "You shall not pass!"})
            .end((err) => {
                if (err) return done(err);
                done();
            })
        })
        it('GET: sends a list of jokes if authorized', (done) => {
            console.log(token)
            request(server)
            .get('/api/jokes')
            .set('Accept', 'application/json')
            .set('authorization', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJsdWViZWxsIiwiaWF0IjoxNTY4OTk3MjAyLCJleHAiOjE1NjkwODM2MDJ9.L2uhCKLNYTdW-b-Ny68_NOi3X_MrOU4ZB6JDcOlDcQk`)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBeGreaterThan(0);
                done();
            })
        })
    })
})