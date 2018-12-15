const express = require("express");
const subCategoryController = require("../controllers/SubCategoryController");
const validateId = require('../middleware/validateObjectId');
const router = express.Router();

router.post('/', subCategoryController.createSubCategory);
router.get('/', subCategoryController.findAllSubCategory);
router.get('/:id', [validateId],subCategoryController.findSubCategoryById);
router.put('/:id', [validateId],subCategoryController.updateSubCategoryWihPUT);
module.exports = router;
