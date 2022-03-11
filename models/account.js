const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  userId: {
    type: Object,
    required: true,
    ref: 'User',
  },
})

module.exports = mongoose.model('Account', accountSchema);