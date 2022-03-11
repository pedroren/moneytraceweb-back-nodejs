/* 
      new CategoryType('Income', false, false, 1),
      new CategoryType('Expense', true, false, 2),
      new CategoryType('Payment', false, true, 3),
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const catTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isExpense: {
    type: Boolean,
    required: true,
    default: true,
  },
  isTransfer: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('CategoryType', catTypeSchema);
