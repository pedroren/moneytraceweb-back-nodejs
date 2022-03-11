const Account = require('../models/account');
const { customErrorWithCode, validateRequest } = require('../util/common');

exports.getAccounts = (req, res, next) => {
  Account.find({ userId: req.userId })
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAccount = (req, res, next) => {
  const id = req.params.id;
  Account.findById(id)
    .then((record) => {
      if (!record) {
        customErrorWithCode(404, 'ID not found');
      }
      res.status(200).json({ data: record });
    })
    .catch((err) => {
      next(err);
    });
};

exports.createAccount = async (req, res, next) => {
  validateRequest(req);

  const name = req.body.name;
  try {
    const record = new Account({
      name: name,
      userId: req.userId,
      balance: 0,
    });
    const result = await record.save();

    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.updateAccount = async (req, res, next) => {
  validateRequest(req);

  const id = req.params.id;
  const name = req.body.name;
  const enabled = req.body.enabled;
  const balance = req.body.balance;

  try {
    const record = await Account.findById(id);
    if (!record) {
      customErrorWithCode(404, 'ID not found');
    }
    record.name = name;
    record.enabled = enabled;
    record.balance = balance;
    const result = await record.save();
    res.status(202).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = (req, res, next) => {
  const id = req.params.id;
  Account.findByIdAndRemove(id).then((result) => {
    res.status(200).json({ result });
  });
};
