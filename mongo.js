

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]


const url =
  `mongodb+srv://admin-santiago:${password}@cluster0.neqzd.mongodb.net/fullstack?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (typeof(personName)!=='undefined'){
  
  const person = new Person({
    name: personName,
    number: personNumber,
    id: 1,
  })
  person.save().then(result => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })

}else{
  Person.find({}).then(result=>{
    console.log('phonebook: ')
    result.forEach(person=>{
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

