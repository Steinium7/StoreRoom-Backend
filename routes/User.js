const express = require('express');
const admin = require('../middleware/admin');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/all', auth, admin, UserController.all);

router.get('/:id', auth, admin, UserController.getbyId);

router.patch('/:id', auth, UserController.updatebyId);

router.delete('/:id', auth, UserController.deletebyId);

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

module.exports = router;
