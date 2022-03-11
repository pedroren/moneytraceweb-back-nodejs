const express = require('express');
const { body } = require('express-validator');

const transController = require('../controllers/transaction');
const Transaction = require('../models/transaction');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/', isAuth, transController.getTransactions);

router.get('/:id', isAuth, transController.getTransaction);

router.post('/', isAuth,[body('name').trim().not().isEmpty()], transController.createTransaction);

router.put('/:id', isAuth,[body('name').trim().not().isEmpty()], transController.updateTransaction);

router.delete('/:id', isAuth, transController.deleteTransaction);

module.exports = router;