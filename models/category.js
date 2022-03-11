const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true,
  },
  categoryTypeId: {
    type: Object,
    required: true,
    ref: 'CategoryType',
  },
  userId: {
    type: Object,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Category', categorySchema);
