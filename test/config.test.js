

const Validace = require("./../src/index")


const schema = new Validace({
    firstName: { type: "string", required: true, /* allowEmptyString: true */ },
    lastName: { type: "string", required: true },
    surName: { type: "string", required: true, allowEmptyString: true },
    age: { type: "number", required: true },
    email: { type: "email", required: true }
})




test("Success: i'm expecting this code to be successful, it allows me to insert empty string and also insert unregistered keys", () => {
    // congiure the schema
    schema.config({
        allowEmptyString: true,
        allowUnregisteredKeys: true
    })

    expect(schema.validate({
        firstName: "",
        lastName: "Ezekiel-Hart",
        surName: "",
        age: 45,
        email: "hartpaulisimo@gmail.com",
        hobbies: "Coding"
    }))
        .toEqual({
            error: null,
            isValid: true,
            data: {
                firstName: '',
                lastName: 'Ezekiel-Hart',
                surName: '',
                age: 45,
                email: 'hartpaulisimo@gmail.com',
                hobbies: 'Coding'
            }
        })




})



test("Failed: i'm expecting an error, as this code would detect the empty fields and also the unregistered hobbie field", () => {

    schema.config({
        allowEmptyString: false,
        allowUnregisteredKeys: false
    })

    expect(schema.validate({
        firstName: "",
        lastName: "Ezekiel-Hart",
        surName: "",
        age: 45,
        email: "hartpaulisimo@gmail.com",
        hobbies: "Coding"
    }))
        .toEqual({
            error: {
                hobbies: { unRegisteredKey: '"hobbies" is not registered on the schema!' },
                firstName: { emptyString: '"firstName" field cannot be empty!' }
            },
            isValid: false,
            data: null
        })
})