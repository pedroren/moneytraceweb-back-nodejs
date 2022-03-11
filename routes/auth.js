const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Invalid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('email already exists!');
          } else {
            return true;
          }
        });
      })
      .normalizeEmail(),
    body('name').trim().not().isEmpty(),
    body('password').trim().isLength({ min: 5 }),
  ],
  authController.signup
);

router.post('/login', authController.postLogin)

router.post('/verifytoken', authController.verifyToken)

module.exports = router;
