const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const createError = require('http-errors')
require('dotenv').config()

const categoryRouter = require('./router/category')
const dishRouter = require('./router/dish')
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json({limit: '1mb'}))
app.use(express.urlencoded({ limit: '1mb', extended: true }))


const PORT = process.env.PORT
const DATABASE = process.env.DATABASE
const PREFIX = "/" + process.env.PREFIX

app.use(PREFIX, categoryRouter)
app.use(PREFIX, dishRouter)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World----> 2022' })
})

app.listen(PORT, async () => {
  console.log('🚀 ~ file: index.js ~ line 27 ~ app.listen ~ PORT', PORT)

  try {
    await mongoose.connect(DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(
      '🚀 ~ file: index.js ~ line 31 ~ app.listen ~ DATABASE',
      PORT,
      DATABASE
    )
  } catch (error) {
    console.log('🚀 ~ file: index.js ~ line 34 ~ app.listen ~ error', error)
  }
})

// Error Creator : 
app.use(async (req, res, next) => { 
  next(createError.NotFound())
})

// Error Handler
app.use((err, req, res, next) => {
  // res.status = err.status || 500;
  console.log(err.status)

  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error'
    }
  })
})