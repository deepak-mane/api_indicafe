const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 25
  },
  addedBy: {
    type: String,
    required: true
  },

  _v: {
    type: Number,
    select:false
  }
  
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)
