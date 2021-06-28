const personRouter = require('express').Router()
const Person = require('../models/person')

// api/persons

personRouter.get('/', async (req, res) => {
    Person.find({}).then( savedEntries => {
        res.json(savedEntries)
    })
})

personRouter.get('/:id', (req, res, next) => {
    const personId = req.params.id
    // const searchResult = persons.find(person => person.id === id)
    Person.findById(personId)
        .then(savedEntry => {
            console.log(savedEntry)
            res.json(savedEntry)
        })
        .catch(error => next(error))
})

personRouter.put('/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, {
        new: true
    })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

personRouter.delete('/:id', (req,res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

personRouter.post('/', (req, res, next) => {
    if(!req.body.name || !req.body.number){
        return res.status(404).json({
            error: 'either the name or number body parameter is missing from the request'
        })
    }
    // const verifyName = persons.find(person => person.name === req.body.name)
    // if (verifyName){
    //     return res.status(404).json({error: 'name must be unique'})
    // }
    const newPerson = new Person({
        name: req.body.name,
        number: req.body.number,
    })

    newPerson.save().then(result => {
        console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`)
        res.status(200).json(result)
    })
        .catch(error => next(error))
    //persons = [...persons, newNote]
    //console.log(persons)
    // res.status(200).json(newNote)
})

personRouter.get('/info', (req, res, next) => {
    Person.find({})
        .then(entries => {
            res.send(`<div>Phonebook has info for ${entries.length} people</div> <div>${new Date()}</div>`)
        })
        .catch(error => next(error) )
})

module.exports = personRouter