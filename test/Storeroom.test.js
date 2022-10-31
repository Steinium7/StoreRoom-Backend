const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const { Storeroom } = require('../models/Storeroom');

jest.setTimeout(30000);

beforeEach((done) => {
    mongoose.connect('mongodb://localhost/JestDBM1', async () => {
        done();
    });
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

describe('/api/Storeroom/all', () => {
    it('should return all storerooms', async () => {
        let newStoreroom = new Storeroom({
            name: 'Storeroom2',
            manager: '123456',
            location: 'Pokuase',
        });

        newStoreroom = await newStoreroom.save();

        if (newStoreroom) {
            await supertest(app)
                .get('/api/storeroom/all')
                .expect(200)
                .then((response) => {
                    expect(response.body[0]).toMatchObject({
                        name: 'Storeroom2',
                        manager: '123456',
                        location: 'Pokuase',
                    });
                });
        }
    });
});

describe('/api/storeroom/create', () => {
    it('should return a data object creating storeroom', async () => {
        await supertest(app)
            .post('/api/storeroom/create')
            .send({
                name: 'Storeroom1',
                manager: '123456',
                location: 'Pokuase',
            })
            .expect(201)
            .then((response) => {
                expect(response.body).toMatchObject({
                    name: 'Storeroom1',
                });
            });
    }),
        it('should return error if storeroom exists or name is taken', async () => {
            let newStoreroom = new Storeroom({
                name: 'Storeroom1',
                manager: '123456',
                location: 'Pokuase',
            });

            newStoreroom = await newStoreroom.save();

            if (newStoreroom) {
                await supertest(app)
                    .post('/api/storeroom/create')
                    .send({
                        name: 'Storeroom1',
                        manager: '123456',
                        location: 'Pokuase',
                    })
                    .expect(400)
                    .then((response) => {
                        expect(response.body.err).toEqual(
                            'Storeroom already exists or name is taken'
                        );
                    });
            }
        });
});

describe('/api/Storeroom/:id', () => {
    it('should return a Storeroom by id', async () => {
        let newStoreroom = new Storeroom({
            name: 'Storeroom1',
            manager: '123456',
            location: 'Pokuase',
        });

        newStoreroom = await newStoreroom.save();

        if (newStoreroom) {
            await supertest(app)
                .get(`/api/storeroom/${newStoreroom._id}`)
                .expect(200)
                .then((response) => {
                    expect(response.body).toMatchObject({
                        name: 'Storeroom1',
                        manager: '123456',
                        location: 'Pokuase',
                    });
                });
        }
    });

    it('should return error if Storeroom is not found', async () => {
        await supertest(app)
            .get('/api/Storeroom/635968d7f845fb5b1cd9510b')
            .expect(404)
            .then((response) => {
                expect(response.body.err).toEqual('Storeroom not found');
            });
    });

    it('should return an updated storeroom detail', async () => {
        let newStoreroom = new Storeroom({
            name: 'Storeroom1',
            manager: '123456',
            location: 'Pokuase',
        });

        newStoreroom = await newStoreroom.save();

        if (newStoreroom) {
            await supertest(app)
                .patch(`/api/Storeroom/${newStoreroom._id}`)
                .send({
                    location: 'Accra',
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toMatchObject({
                        name: 'Storeroom1',
                        manager: '123456',
                        location: 'Accra',
                    });
                });
        }
    });

    it('should delete a Storeroom', async () => {
        let newStoreroom = new Storeroom({
            name: 'Storeroom1',
            manager: '123456',
            location: 'Pokuase',
        });

        newStoreroom = await newStoreroom.save();

        if (newStoreroom) {
            await supertest(app)
                .delete(`/api/Storeroom/${newStoreroom._id}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.msg).toEqual('Deleted');
                });
        }
    });
});
