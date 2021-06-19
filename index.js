const express = require('express')
var morgan = require('morgan')
const utilities = require('./utilities')
const app = express()
const cors = require('cors')

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

app.get('/info', (req, res)=>{
    res.send(`<div>Phonebook has info for ${persons.length} people</div> <div>${new Date()}</div>`)
})

app.get('/api/persons', async (req, res)=>{
    res.json(persons)
})

app.get('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    const searchResult = persons.find(person => person.id === id)
    console.log(searchResult)
    res.json(searchResult)
})

app.delete('/api/persons/:id', (req,res)=>{
    const id = Number(req.params.id)
    if (persons.length!=0){
        persons = persons.filter(person => person.id != id)
        res.status(204).end()
    }
    res.status(404).end()
})

app.post('/api/persons', (req, res)=>{
    
    if(!req.body.name || !req.body.number){
        return res.status(404).json({error: 'either the name or number body parameter is missing from the request'})
    }
    const verifyName = persons.find(person => person.name === req.body.name)
    if (verifyName){
        return res.status(404).json({error: 'name must be unique'})
    }
    const newNote = {
        name: req.body.name,
        number: req.body.number,
        id: utilities.getRandomId()
    }
    //persons = [...persons, newNote]
    //console.log(persons)
    res.status(200).json(newNote)
})

function printBody (req, res, next){
    console.log(req.body)
    next()
}

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})