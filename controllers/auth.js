const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { verifyToken, initializeBasics } = require('../util/common');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashedPass,
    });
    const result = await user.save();
    //Initialize basics
    await initializeBasics(result._id);
    //
    res.status(201).json({ message: 'User created', userId: result._id });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error('Email not found!');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error('Invalid password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      'serversecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    next(err);
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.body.token;
  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    res.status(401).json({ message: 'Invalid token' });
  } else {
    res.status(200).json({ message: 'OK' });
  }
};

exports.reqResetPassword = (req, res, next) => {
  //Save resetToken and send email
};
