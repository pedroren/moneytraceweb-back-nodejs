const { validationResult } = require('express-validator');
const Account = require('../models/account');
const Category = require('../models/category');

const Transaction = require('../models/transaction');
const { customErrorWithCode, validateRequest } = require('../util/common');

exports.getTransactions = async (req, res, next) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pagesize || 10;
  const accountId = req.query.accountId || null;
  const categoryId = req.query.categoryId || null;
  const startDate = req.query.startDate || null;
  const endDate = req.query.endDate || null;

  //to-do: filters
  let filter = { userId: req.userId };
  if (accountId) {
    filter = { ...filter, accountId: accountId };
  }
  if (categoryId) {
    filter = { ...filter, categoryId: categoryId };
  }
  try {
    const result = await Transaction.find(filter)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  const id = req.params.id;
  try {
    const record = await Transaction.findById(id);
    if (!record) {
      customErrorWithCode(404, 'ID not found');
    }
    res.status(200).json({ data: record });
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  validateRequest(req);

  const name = req.body.name;
  const amount = req.body.amount;
  const date = req.body.date;
  const categoryId = req.body.categoryId;
  const accountId = req.body.accountId;
  const destAccountId = req.body.destAccountId;
  const description = req.body.description;

  const category = await Category.findById(categoryId).populate('CategoryType');
  const account = await Account.findById(accountId);

  try {
    const record = new Transaction({
      name: name,
      amount: amount,
      date: date,
      categoryId: categoryId,
      accountId: accountId,
      destAccountId: destAccountId,
      description: description,
      userId: req.userId,
    });
    const result = await record.save();

    let affectAmount = amount;
    if (category.categoryType.isTransfer) {
      const destAccount = await Account.findById(destAccountId);
      destAccount.balance = destAccount.balance + amount;
      destAccount.save();
      account.balance = account.balance - amount;
      account.save();
    } else {
      if (!category.categoryType.isExpense) {
        affectAmount = amount + -1;
      }
      account.balance = account.balance - affectAmount;
      account.save();
    }

    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  validateRequest(req);

  const id = req.params.id;
  const name = req.body.name;
  const amount = req.body.amount;
  const date = req.body.date;
  const category = req.body.category;
  const account = req.body.account;
  const destAccount = req.body.destAccount;
  const description = req.body.description;

  try {
    const record = await Transaction.findById(id);
    if (!record) {
      customErrorWithCode(404, 'ID not found');
    }
    record.name = name;
    record.amount = amount;
    record.date = date;
    record.category = category;
    record.account = account;
    record.destAccount = destAccount;
    record.description = description;

    const result = await record.save();
    res.status(202).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = (req, res, next) => {
  const id = req.params.id;
  Transaction.findByIdAndRemove(id).then((result) => {
    res.status(200).json({ result });
  });
};
