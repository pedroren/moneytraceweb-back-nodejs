const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const categoryRoutes = require('./routes/category');
const currencyRoutes = require('./routes/currency');
const transRoutes = require('./routes/transaction');

const CategoryType = require('./models/category-type');

const app = express();

//Register parsers
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//Register routes
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/category', categoryRoutes);
app.use('/currency', currencyRoutes);
app.use('/transaction', transRoutes);

//Error handling route
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//Mongoose db connect

mongoose
  .connect(
    'mongodb+srv://yourdb/moneytrace?retryWrites=true&w=majority'
  )
  .then((result) => {
    console.log('mongodb connected');
    //one time initialization
    CategoryType.find().then((catTypes) => {
      if (catTypes.length === 0) {
        new CategoryType({
          name: 'Income',
          isExpense: false,
          isTransfer: false,
        }).save();
        new CategoryType({
          name: 'Expense',
          isExpense: true,
          isTransfer: false,
        }).save();
        new CategoryType({
          name: 'Payment',
          isExpense: false,
          isTransfer: true,
        }).save();
      }
    });
    app.listen(8080);
    console.log('Listening at', 'http://localhost:8080');
  })
  .catch((err) => {
    console.log(err);
  });
