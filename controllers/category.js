const { validationResult } = require('express-validator');

const Category = require('../models/category');
const CategoryType = require('../models/category-type');
const { customErrorWithCode, validateRequest } = require('../util/common');

exports.getCategories = (req, res, next) => {
  Category.find({ userId: req.userId })
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCategoryTypes = (req, res, next) => {
  CategoryType.find()
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCategory = (req, res, next) => {
  const id = req.params.id;
  Category.findById(id)
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

exports.createCategory = async (req, res, next) => {
  validateRequest(req);

  const name = req.body.name;
  const catType = req.body.categoryTypeId;
  try {
    const record = new Category({
      name: name,
      categoryTypeId: catType,
      userId: req.userId,
    });
    const result = record.save();
    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  validateRequest(req);

  const id = req.params.id;
  const name = req.body.name;
  const enabled = req.body.enabled;
  const catType = req.body.categoryTypeId;
  try {
    const record = await Category.findById(id);
    if (!record) {
      customErrorWithCode(404, 'ID not found');
    }
    record.name = name;
    record.enabled = enabled;
    record.categoryTypeId = catType;
    const result = await record.save();

    res.status(202).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = (req, res, next) => {
  const id = req.params.id;
  Category.findByIdAndRemove(id).then((result) => {
    res.status(200).json({ result });
  });
};
