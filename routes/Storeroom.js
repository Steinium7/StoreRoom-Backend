const express = require('express');
const StoreroomController = require('../controllers/StoreroomController');
const router = express.Router();
const owner = require('../middleware/owner');
const auth = require('../middleware/auth');

router.post('/create', auth, owner, StoreroomController.create);

router.get('/all', auth, owner, StoreroomController.all);

router.get('/:id', auth, owner, StoreroomController.getbyId);

router.patch('/:id', auth, owner, StoreroomController.updatebyId);

router.delete('/:id', auth, owner, StoreroomController.deletebyId);

module.exports = router;
