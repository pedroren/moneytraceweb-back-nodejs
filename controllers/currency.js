const { validationResult } = require('express-validator');

const Currency = require('../models/currency');
const { customErrorWithCode, validateRequest } = require('../util/common');

exports.getCurrencies = (req, res, next) => {
  Currency.find({ userId: req.userId })
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCurrency = (req, res, next) => {
  const id = req.params.id;
  Currency.findById(id)
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

exports.createCurrency = async (req, res, next) => {
  validateRequest(req);

  const name = req.body.name;
  const isMain = req.body.ismain;
  try {
    const record = new Currency({
      name: name,
      isMain: isMain,
      userId: req.userId,
    });
    const result = await record.save();
    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.updateCurrency = async (req, res, next) => {
  validateRequest(req);

  const id = req.params.id;
  const name = req.body.name;
  const enabled = req.body.enabled;
  const isMain = req.body.ismain;
  try {
    const record = await Currency.findById(id);
    if (!record) {
      customErrorWithCode(404, 'ID not found');
    }
    record.name = name;
    record.enabled = enabled;
    record.isMain = isMain;
    const result = await record.save();
    res.status(202).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.deleteCurrency = (req, res, next) => {
  const id = req.params.id;
  Currency.findByIdAndRemove(id).then((result) => {
    res.status(200).json({ result });
  });
};
