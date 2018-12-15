const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const auth = require('../middleware/auth');
const validateId = require('../middleware/validateObjectId');

/*
* Category Router
* Handle All Of Category Model
* */
router.post('/', [auth], categoryController.addCategory);

router.get('/', categoryController.findAllCategories);

router.get('/:id', [validateId], categoryController.findById);

router.delete('/:id', [auth, validateId], categoryController.deleteById);

router.put('/:id', [auth, validateId], categoryController.updateByIdPut);

router.patch('/:id', [auth, validateId], categoryController.updateByIdPatch);

module.exports = router;