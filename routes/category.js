const express = require('express');
const { body } = require('express-validator');

const categoryController = require('../controllers/category');
const Category = require('../models/category');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, categoryController.getCategories);

router.get('/types', categoryController.getCategoryTypes);

router.get('/:id', isAuth, categoryController.getCategory);

router.post(
  '/',
  isAuth,
  [body('name').trim().not().isEmpty()],
  categoryController.createCategory
);

router.put(
  '/:id',
  isAuth,
  [body('name').trim().not().isEmpty()],
  categoryController.updateCategory
);

router.delete('/:id', isAuth, categoryController.deleteCategory);

module.exports = router;
