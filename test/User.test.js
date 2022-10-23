const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

jest.setTimeout(8000);

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

describe('Model function', () => {
    it('should gen a token', async () => {
        let user = User({
            name: 'Michael AO',
            phone: 84567876545,
            email: 'mae@mg.com',
            password: 'superman',
        });
        user = await user.save();

        const token = user.generateToken();
        let word = jwt.verify(token, config.get('jwtKey'));
        expect(word).toBeDefined();
    });
});

describe('/api/user/signup', () => {
    it('should return a data object after signup', async () => {
        await supertest(app)
            .post('/api/user/signup')
            .send({
                name: 'Mike the Anorak',
                email: 'home@hotmail.com',
                phone: '0241333633',
                password: '1234567890',
            })
            .expect(201)
            .then((response) => {
                expect(response.body).toMatchObject({
                    name: 'Mike the Anorak',
                    email: 'home@hotmail.com',
                });
            });
    }),
        it('should return error if user exists', async () => {
            let newUser = new User({
                name: 'Mike the Anorak',
                email: 'home@hotmail.com',
                phone: '0241333633',
                password: '1234567890',
            });

            newUser = await newUser.save();

            if (newUser) {
                await supertest(app)
                    .post('/api/user/signup')
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

describe('/api/user/login', () => {
    it('should return token on login', async () => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('1234567890', salt);

        let newUser = new User({
            name: 'Mike the Anorak',
            email: 'home@hotmail.com',
            phone: '0241333633',
            password: hash,
        });

        newUser = await newUser.save();

        if (newUser) {
            await supertest(app)
                .post('/api/user/login')
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
        it('should return error if user does not exist', async () => {
            await supertest(app)
                .post('/api/user/login')
                .send({
                    email: 'home@hotmail.com',
                    password: '1234567890',
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.err).toEqual('User does not exist');
                });
        }),
        it('should return error if password is incorrect', async () => {
            let newUser = new User({
                name: 'Mike the Anorak',
                email: 'home@hotmail.com',
                phone: '0241333633',
                password: '1234567890',
            });

            newUser = await newUser.save();

            if (newUser) {
                await supertest(app)
                    .post('/api/user/login')
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
