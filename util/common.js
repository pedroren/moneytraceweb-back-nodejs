const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const Account = require('../models/account');
const CategoryType = require('../models/category-type');
const Category = require('../models/category');
const Transaction = require('../models/transaction')

exports.customErrorWithCode = (code, message) => {
  const error = new Error(message);
  error.statusCode = code || 500;
  throw error;
};

exports.verifyToken = (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'serversecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    return null;
  }
  return decodedToken;
};

exports.initializeBasics = async (userId) => {
  const newAccount1 = new Account({
    name: 'CASH',
    enabled: true,
    userId: userId,
  });

  const newAccount2 = new Account({
    name: 'Credit Card',
    enabled: true,
    userId: userId,
  });

  const catTypes = await CategoryType.find();
  const ctIncome = catTypes.find((c) => c.name === 'Income');
  const ctExpense = catTypes.find((c) => c.name === 'Expense');
  const ctPayment = catTypes.find((c) => c.name === 'Payment');
  const newCategory1 = new Category({
    name: 'Food',
    categoryTypeId: ctExpense._id,
    userId: userId,
  });

  const newCategory2 = new Category({
    name: 'Gas',
    categoryTypeId: ctExpense._id,
    userId: userId,
  });

  const newCategory3 = new Category({
    name: 'Salary',
    categoryTypeId: ctIncome._id,
    userId: userId,
  });

  await Promise.all([
    newAccount1.save(),
    newAccount2.save(),
    newCategory1.save(),
    newCategory2.save(),
    newCategory3.save(),
  ]);

  return true;
};

exports.removeUserDocuments = async (userId) => {
  await Transaction.remove({userId: userId});
  await Account.remove({userId: userId});
  await Category.remove({userId: userId});
  return true;
}

exports.validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    customErrorWithCode(422, 'Validation Failed!');
  }
}
