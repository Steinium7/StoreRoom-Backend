const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const { generateStoreroomInv } = require('../models/Storeroom');
let Inventory = generateStoreroomInv('teststore');

jest.setTimeout(30000);

beforeEach((done) => {
    mongoose.connect('mongodb://localhost/JestDBM6', async () => {
        done();
    });
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

describe('/api/Inventory/all/:store', () => {
    it('should return all Inventories for a given store', async () => {
        let newInventory = new Inventory({
            name: 'Inventory2',
            amount: 5000,
            number: 200,
            packMethod: '6 in 1',
        });

        newInventory = await newInventory.save();

        if (newInventory) {
            await supertest(app)
                .get('/api/inventory/all/teststore')
                .expect(200)
                .then((response) => {
                    expect(response.body[0]).toMatchObject({
                        name: 'Inventory2',
                        amount: 5000,
                        number: 200,
                        packMethod: '6 in 1',
                    });
                });
        }
    });
});

describe('/api/Inventory/create/:store', () => {
    it('should return a data object created Inventory', async () => {
        await supertest(app)
            .post('/api/inventory/create/teststore')
            .send({
                name: 'Inventory1',
                amount: 5000,
                number: 200,
                packMethod: '6 in 1',
            })
            .expect(201)
            .then((response) => {
                expect(response.body).toMatchObject({
                    name: 'Inventory1',
                });
            });
    }),
        it('should return error if Inventory exists or name is taken', async () => {
            let newInventory = new Inventory({
                name: 'Inventory1',
                amount: 5000,
                number: 200,
                packMethod: '6 in 1',
            });

            newInventory = await newInventory.save();

            if (newInventory) {
                await supertest(app)
                    .post('/api/inventory/create/teststore')
                    .send({
                        name: 'Inventory1',
                        amount: 5000,
                        number: 200,
                        packMethod: '6 in 1',
                    })
                    .expect(400)
                    .then((response) => {
                        expect(response.body.err).toEqual(
                            'Item already exists or name is taken'
                        );
                    });
            }
        });
});

describe('/api/Inventory/:id/:store', () => {
    it('should return a Inventory by id', async () => {
        let newInventory = new Inventory({
            name: 'Inventory1',
            amount: 5000,
            number: 200,
            packMethod: '6 in 1',
        });

        newInventory = await newInventory.save();

        if (newInventory) {
            await supertest(app)
                .get(`/api/inventory/${newInventory._id}/teststore`)
                .expect(200)
                .then((response) => {
                    expect(response.body).toMatchObject({
                        name: 'Inventory1',
                        amount: 5000,
                        number: 200,
                        packMethod: '6 in 1',
                    });
                });
        }
    });

    it('should return error if Inventory is not found', async () => {
        await supertest(app)
            .get('/api/inventory/635968d7f845fb5b1cd9510b/teststore')
            .expect(404)
            .then((response) => {
                expect(response.body.err).toEqual('Item not found');
            });
    });

    it('should return an updated Inventory detail', async () => {
        let newInventory = new Inventory({
            name: 'Inventory1',
            amount: 5000,
            number: 200,
            packMethod: '6 in 1',
        });

        newInventory = await newInventory.save();

        if (newInventory) {
            await supertest(app)
                .patch(`/api/inventory/${newInventory._id}/teststore`)
                .send({
                    number: 300,
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toMatchObject({
                        name: 'Inventory1',
                        amount: 5000,
                        number: 300,
                        packMethod: '6 in 1',
                    });
                });
        }
    });

    it('should delete a Inventory', async () => {
        let newInventory = new Inventory({
            name: 'Inventory1',
            amount: 5000,
            number: 200,
            packMethod: '6 in 1',
        });

        newInventory = await newInventory.save();

        if (newInventory) {
            await supertest(app)
                .delete(`/api/inventory/${newInventory._id}/teststore`)
                .expect(200)
                .then((response) => {
                    expect(response.body.msg).toEqual('Deleted');
                });
        }
    });
});
