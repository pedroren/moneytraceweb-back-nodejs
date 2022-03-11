const { validationResult } = require('express-validator');

const User = require('../models/user');
const { removeUserDocuments } = require('../util/common');

exports.updateUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  try {
    const record = await User.findById(req.userId);
    if (!record) {
      customErrorWithCode(404, 'ID not found');
    }
    record.name = name;
    record.email = email;
    const result = await record.save();
    res.status(202).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      customErrorWithCode(404, 'ID not found');
    }
    await removeUserDocuments();
    const result = User.findByIdAndRemove(req.userId);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = (req, res, next) => {
  //Validate resetToken
  //Save new password and redirect to login
};
