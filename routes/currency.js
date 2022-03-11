const express = require('express');
const { body } = require('express-validator');

const currencyController = require('../controllers/currency');
const Currency = require('../models/currency');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, currencyController.getCurrencies);

router.get('/:id', isAuth, currencyController.getCurrency);

router.post(
  '/',
  isAuth,
  [body('name').trim().not().isEmpty()],
  currencyController.createCurrency
);

router.put(
  '/:id',
  isAuth,
  [body('name').trim().not().isEmpty()],
  currencyController.updateCurrency
);

router.delete('/:id', isAuth, currencyController.deleteCurrency);

module.exports = router;
