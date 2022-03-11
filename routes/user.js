const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.put('/:id', isAuth, userController.updateUser);

router.delete('/:id', isAuth, userController.deleteUser);

module.exports = router;