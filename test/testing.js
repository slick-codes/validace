const Validace = require('../src/index')

console.clear()
console.clear()
console.log()
console.log()
console.log()

// set schema properties
const schema = new Validace({
    firstName: { type: 'string', required: true /* allowEmptyString: true */ },
    lastName: { type: 'string', required: true },
    surName: { type: 'string', required: true, allowEmptyString: [false, ' (%key%) should not be empty'] },
    age: { type: 'number', required: true },
    email: { type: 'email', required: true },
})

// set configuration
schema.config({
    allowUnregisteredKeys: false,
    allowEmptyString: false, // this prevents any empty string, note: this will be overwritten if you use the allowEmptyString inside the schema field
})

// validate data
const result = schema.validate({
    firstName: '',
    lastName: 'Ezekiel-Hart',
    surName: '',
    age: 45,
    email: 'hartpaulisimo@gmail.com',
    hobbies: 'Coding',
})

console.log(result)

console.log()
console.log()

