require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const utilities = require('./utilities')
const app = express()
const cors = require('cors')

const Person = require('./models/person')
const { response } = require('express')

morgan.token('data', (req)=>{
    return JSON.stringify(req.body)
})
app.use(cors())
app.use(express.json())
app.use(printBody)
app.use(morgan(':method :url :response-time :data '))
app.use(express.static('build'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "3148853032",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Nali",
        "number": "123",
        "id": 5
    },
    {
        "name": "santiago",
        "number": "5",
        "id": 6
    },
    {
        "name": "Catalina",
        "number": "8",
        "id": 7
    },
    {
        "name": "Karen",
        "number": "1",
        "id": 8
    }
]

app.get('/info', (req, res, next)=>{
    Person.find({})
    .then(entries =>{
        res.send(`<div>Phonebook has info for ${entries.length} people</div> <div>${new Date()}</div>`)
    })
    .catch(error => next(error) )
})

app.get('/api/persons', async (req, res)=>{
    Person.find({}).then( savedEntries=>{
        res.json(savedEntries)
    })
})

app.get('/api/persons/:id', (req, res, next)=>{
    const personId = req.params.id
    // const searchResult = persons.find(person => person.id === id)
    
    Person.findById(personId)
    .then(savedEntry=>{
        console.log(savedEntry)
        res.json(savedEntry)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next)=>{
    const body = req.body;
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req,res, next)=>{    
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next)=>{
    
    if(!req.body.name || !req.body.number){
        return res.status(404).json({error: 'either the name or number body parameter is missing from the request'})
    }
    const verifyName = persons.find(person => person.name === req.body.name)
    if (verifyName){
        return res.status(404).json({error: 'name must be unique'})
    }
    const newPerson = new Person({
        name: req.body.name,
        number: req.body.number,
    })

    newPerson.save().then(result=>{
        console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`);
        res.status(200).json(result)
    })
    .catch(error => next(error))
    //persons = [...persons, newNote]
    //console.log(persons)
    // res.status(200).json(newNote)
})

function printBody (req, res, next){
    // console.log(req.body)
    next()
}
app.use((req, res, next)=>{
    res.status(404).send({message:"Not Found"});
  });

const errorHandler = (error, req, res, next)=>{
    console.log(error.message)
    console.log('error name', error.name)
    if (error.name === 'CastError'){
        return res.status(400).send({error: 'malformatted id'})
    }else if(error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})