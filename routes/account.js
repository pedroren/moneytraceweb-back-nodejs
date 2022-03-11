const express = require('express');
const { body } = require('express-validator');

const accountController = require('../controllers/account');
const Account = require('../models/account');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, accountController.getAccounts);

router.get('/:id', isAuth, accountController.getAccount);

router.post(
  '/',
  isAuth,
  [body('name').trim().not().isEmpty(),
  body('balance').isNumeric()],
  accountController.createAccount
);

router.put(
  '/:id',
  isAuth,
  [body('name').trim().not().isEmpty(),
  body('balance').isNumeric()],
  accountController.updateAccount
);

router.delete('/:id', isAuth, accountController.deleteAccount);

module.exports = router;
