const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const currencySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isMain: {
    type: Boolean,
    required: true,
    default: false
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  userId: {
    type: Object,
    required: true,
    ref: 'User',
  },
})

module.exports = mongoose.model('Currency', currencySchema);