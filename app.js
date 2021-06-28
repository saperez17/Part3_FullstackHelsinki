const config = require('./utils/config')
const mongoose = require('mongoose')
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const personRouter = require('./controllers/person')
const middleware = require('./utils/middleware')
morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})

const url = config.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
  
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :response-time :data '))
app.use(express.static('build'))
app.use(middleware.requestLogger)

app.use('/api/persons', personRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app