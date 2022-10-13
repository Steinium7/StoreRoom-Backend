const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');

jest.setTimeout(10000);

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

describe('/api/user', () => {
    it('should return a data object', async () => {
        await supertest(app)
            .post('/api/user/signup')
            .send({
                name: 'Mike the Anorak',
                email: 'home@hotmail.com',
                phone: '0241333633',
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toMatchObject({
                    name: 'Mike the Anorak',
                    email: 'home@hotmail.com',
                    phone: 241333633,
                });
            });
    }),
        it('some', () => {
            expect(1).toEqual(1);
        });
});
