const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  },
  categoryId: {
    type: Object,
    required: false,
    ref: 'Category'
  },
  accountId: {
    type: Object,
    required: false,
    ref: 'Account'
  },
  destAccountId: {
    type: Object,
    required: false,
    ref: 'Account'
  },
  description: {
    type: String,
    required: false
  },
  userId: {
    type: Object,
    required: true,
    ref: 'User',
  },
})

module.exports = mongoose.model('Transaction', transactionSchema);