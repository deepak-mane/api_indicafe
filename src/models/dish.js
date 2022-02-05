const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 25
  },
  description: {
    type: String,
    required: true,
    maxLength: 200
  },
  price: {
    type: Number,
    required: true,
    min: [1, 'Dish is not free'],
    max: [100, 'Dish cannot be more than 100 Rs']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  _v: {
    type: Number,
    select: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Dish', dishSchema)
