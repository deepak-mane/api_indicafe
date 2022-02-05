const Dish = require('../models/dish')
const { dishSchema } = require('../validators/schema-validator')
const imageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
const createError = require('http-errors')
const mongoose = require('mongoose')


exports.getDishPhoto = (req, res) => { 
  const dish = req.dish

  if (dish.photo.data) {
    res.set('Content-Type', dish.photo.contentType)
    res.send(dish.photo.data)
  } else {
    return res.status(204).json({ message: 'No Data Found!!!'})
  }
}

exports.createDish = async (req, res, next) => {
  console.log("🚀 ~ file: dish.js ~ line 7 ~ exports.createDish= ~ req", req.body)
  const { name, description, price, category, photo } = req.body
  
  try {
    const result = await dishSchema.validateAsync({ name, description, price, category })
    let dish = new Dish(result)
    dish.addedBy = "dsm";
    
    savePhoto(dish, photo)
    const newDish = await dish.save()
    newDish.photo = undefined

    res.status(201).json(newDish)

  } catch (error) {
    console.log("🚀 ~ file: dish.js ~ line 19 ~ exports.createDish= ~ error", error)

    if (error.isJoi === true) error.status = 422
    if (error.message.includes("category")) {
      return next(createError.Conflict(`The Dish  ${category} category validation failed with value [${category}]. Correct the error and try again...`))
     }    
    if (error.message.includes("price")) {
      return next(createError.Conflict(`The Dish  ${name} price validation failed with value ${price}. Allowed price range is between Rs1 and Rs100. Correct the error and try again...`))
     }
    if (error.message.includes("E11000")) { 
      return next(createError.Conflict(`The Dish  ${name} already exists. Correct the error and try again...`))
    }
    next(createError(error))   
  }
 
}

function savePhoto(dish, photo) { 
  // To Handle Empty object scenario using lodash
  if (photo !== null && imageTypes.includes(photo.type)) {
    dish.photo.data = new Buffer.from(photo.data, 'base64')
    dish.photo.contentType = photo.type
   }
}

exports.fetchDishById = (req, res) => {
  req.dish.photo = undefined
  res.status(200).json(req.dish)
}

exports.fetchDish = async (req, res, next, id) => { 

  try { 
    const dish = await Dish.findById(id)
    if(!dish) throw createError(404, "Dish not found")

    req.dish = dish
    next()

  } catch (error) { 
    console.log("🚀 ~ file: dish.js ~ line 63 ~ exports.fetchDish= ~ error", error)
    if (error instanceof mongoose.CastError) { 
      return next(createError(400, 'Invalid Dish Id'))
    }
    next(error)    
  }
}

exports.fetchDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find().select('-photo').populate('category', '_id,name');
    
    if (dishes.length === 0) {
      next(createError(404, 'No Dishes found!!!'))
      return
    }
    
    res.status(200).json(dishes)
    
   } catch (error) {
    console.log("🚀 ~ file: dish.js ~ line 81 ~ exports.fetchDishes= ~ error", error)
    next(error)
  }
}
 

