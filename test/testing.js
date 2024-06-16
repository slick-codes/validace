

const Validace = require("../src/index")

console.clear();
console.clear();
console.log()
console.log()

// set schema properties
const schema = new Validace({
    firstName: { type: "String", required: true, /* allowEmptyString: true */ },
    lastName: { type: "String", required: true },
    surName: { type: "string", required: true, allowEmptyString: false },
    age: { type: "number", required: true },
    email: { type: "email", required: true }
})

// set configuration
schema.config({
    allowUnregisteredKeys: true,
    allowEmptyString: true  // this prevents any empty string, note: this will be overwritten if you use the allowEmptyString inside the schema field
})

// validate data
const result = schema.validate({
    firstName: "",
    lastName: "Ezekiel-Hart",
    surName: "",
    age: 45,
    email: "hartpaulisimo@gmail.com",
    hobbies: "Coding"
})




console.log(result)

console.log()
console.log()