const express = require('express');
const WorkerController = require('../controllers/WorkerController');
const manager = require('../middleware/manager');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/all', auth, manager, WorkerController.all);

router.get('/:id', auth, manager, WorkerController.getbyId);

// To correct later
router.patch('/:id', auth, manager, WorkerController.updatebyId);

router.delete('/:id', auth, manager, WorkerController.deletebyId);

router.post('/signup/:id', WorkerController.signup);

router.post('/login', WorkerController.login);

module.exports = router;
