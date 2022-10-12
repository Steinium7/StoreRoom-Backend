const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')

jest.setTimeout(30000)

beforeEach((done) => {
    mongoose.connect('mongodb://localhost/JestDBM', async () => {
        done();
    });
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

describe('/api/home', () =>{
    it('should return a data object', async ()=>{
        await supertest(app)
            .get('/api/home/')
            .expect(200)
            .then((response)=>{
                expect(response.body).toMatchObject({data:'1'})
            })
    }, 30000),

    it('some', ()=>{
        expect(1).toEqual(1)
    })


})