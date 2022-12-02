const express = require('express');
const manager = require('../middleware/manager');
const auth = require('../middleware/auth');
const worker = require('../middleware/worker');
const InventoryController = require('../controllers/InventoryController');
const router = express.Router();

router.post('/create/:store', auth, worker, InventoryController.create);

router.get('/all/:store', auth, manager, InventoryController.all);

//adding number of items to be resolved
router.get('/:id/:store', auth, manager, InventoryController.getbyId);

router.patch('/:id/:store', auth, worker, InventoryController.updatebyId);

router.delete('/:id/:store', auth, manager, InventoryController.deletebyId);

module.exports = router;
