const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const Worker = require('../models/Worker');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
jest.mock('../middleware/manager');
jest.mock('../middleware/auth');
jest.mock('../middleware/worker');
jest.mock('../middleware/admin');
jest.mock('../middleware/owner');
const manager = require('../middleware/manager');
const auth = require('../middleware/auth');
const worker = require('../middleware/worker');
const admin = require('../middleware/admin');
const owner = require('../middleware/owner');

auth.mockImplementation((req, res, next) => next());
admin.mockImplementation((req, res, next) => next());
owner.mockImplementation((req, res, next) => next());
worker.mockImplementation((req, res, next) => next());
manager.mockImplementation((req, res, next) => next());

jest.setTimeout(30000);

beforeEach((done) => {
    mongoose.connect('mongodb://localhost/JestDBM3', async () => {
        done();
    });
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

describe('Model function', () => {
    it('should gen a token', async () => {
        let worker = Worker({
            name: 'Michael AO',
            phone: 84567876545,
            email: 'mae@mg.com',
            assignedShop: 'something',
            password: 'superman',
        });
        worker = await worker.save();

        const token = worker.generateToken();
        let word = jwt.verify(token, config.get('jwtKey'));
        expect(word).toBeDefined();
    });
});

describe('/api/worker/all', () => {
    it('should return all workers', async () => {
        let newWorker = new Worker({
            name: 'Mike the Anorak',
            email: 'home@hotmail.com',
            phone: '0241333633',
            password: '1234567890',
            assignedShop: 'something',
        });

        newWorker = await newWorker.save();

        if (newWorker) {
            await supertest(app)
                .get('/api/worker/all')
                .expect(200)
                .then((response) => {
                    expect(response.body[0]).toMatchObject({
                        name: 'Mike the Anorak',
                        email: 'home@hotmail.com',
                        phone: 241333633,
                        assignedShop: 'something',
                    });
                });
        }
    });
});

describe('/api/worker/signup/:id', () => {
    it('should return a data object after signup', async () => {
        await supertest(app)
            .post('/api/worker/signup/123456')
            .send({
                name: 'Mike the Anorak',
                email: 'home@hotmail.com',
                phone: '0241333633',
                password: '1234567890',
                assignedShop: 'something',
            })
            .expect(201)
            .then((response) => {
                expect(response.body).toMatchObject({
                    name: 'Mike the Anorak',
                    email: 'home@hotmail.com',
                });
            });
    }),
        it('should return error if worker exists', async () => {
            let newWorker = new Worker({
                name: 'Mike the Anorak',
                email: 'home@hotmail.com',
                phone: '0241333633',
                password: '1234567890',
                assignedShop: 'something',
            });

            newWorker = await newWorker.save();

            if (newWorker) {
                await supertest(app)
                    .post('/api/worker/signup/12345')
                    .send({
                        name: 'Mike the Anorak',
                        email: 'home@hotmail.com',
                        phone: '0241333633',
                        password: '1234567890',
                    })
                    .expect(400)
                    .then((response) => {
                        expect(response.body.err).toEqual(
                            'Email Already Exists'
                        );
                    });
            }
        });
});

describe('/api/worker/login', () => {
    it('should return token on login', async () => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('1234567890', salt);

        let newWorker = new Worker({
            name: 'Mike the Anorak',
            email: 'home@hotmail.com',
            phone: '0241333633',
            assignedShop: 'something',
            password: hash,
        });

        newWorker = await newWorker.save();

        if (newWorker) {
            await supertest(app)
                .post('/api/worker/login')
                .send({
                    email: 'home@hotmail.com',
                    password: '1234567890',
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toBeDefined();
                });
        }
    }),
        it('should return error if worker does not exist', async () => {
            await supertest(app)
                .post('/api/worker/login')
                .send({
                    email: 'home@hotmail.com',
                    password: '1234567890',
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.err).toEqual('Worker does not exist');
                });
        }),
        it('should return error if password is incorrect', async () => {
            let newWorker = new Worker({
                name: 'Mike the Anorak',
                email: 'home@hotmail.com',
                phone: '0241333633',
                password: '1234567890',
                assignedShop: 'something',
            });

            newWorker = await newWorker.save();

            if (newWorker) {
                await supertest(app)
                    .post('/api/worker/login')
                    .send({
                        email: 'home@hotmail.com',
                        password: 'looneytunes',
                    })
                    .expect(400)
                    .then((response) => {
                        expect(response.body.err).toEqual(
                            'Invalid Credentials'
                        );
                    });
            }
        });
});

describe('/api/worker/:id', () => {
    it('should return a worker by id', async () => {
        let newWorker = new Worker({
            name: 'Mike the Anorak',
            email: 'home@hotmail.com',
            phone: '0241333633',
            password: '1234567890',
            assignedShop: 'something',
        });

        newWorker = await newWorker.save();

        if (newWorker) {
            await supertest(app)
                .get(`/api/worker/${newWorker._id}`)
                .expect(200)
                .then((response) => {
                    expect(response.body).toMatchObject({
                        name: 'Mike the Anorak',
                        email: 'home@hotmail.com',
                        phone: 241333633,
                    });
                });
        }
    });

    it('should return error if worker is not found', async () => {
        await supertest(app)
            .get('/api/worker/635968d7f845fb5b1cd9510b')
            .expect(404)
            .then((response) => {
                expect(response.body.err).toEqual('Worker not found');
            });
    });

    it('should return an updated user detail', async () => {
        let newWorker = new Worker({
            name: 'Mike the Anorak',
            email: 'home@hotmail.com',
            phone: '0241333633',
            password: '1234567890',
            assignedShop: 'something',
        });

        newWorker = await newWorker.save();

        if (newWorker) {
            await supertest(app)
                .patch(`/api/worker/${newWorker._id}`)
                .send({
                    name: 'Mike the Superman',
                    email: 'home@hotmail.com',
                    phone: 241333633,
                    // password: '1234567890',
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toMatchObject({
                        name: 'Mike the Superman',
                        email: 'home@hotmail.com',
                        phone: 241333633,
                    });
                });
        }
    });

    it('should delete a worker', async () => {
        let newWorker = new Worker({
            name: 'Mike the Anorak',
            email: 'home@hotmail.com',
            phone: '0241333633',
            password: '1234567890',
            assignedShop: 'something',
        });

        newWorker = await newWorker.save();

        if (newWorker) {
            await supertest(app)
                .delete(`/api/worker/${newWorker._id}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.msg).toEqual('Deleted');
                });
        }
    });
});
