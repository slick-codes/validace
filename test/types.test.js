const Schema = require("./../src/index")


const types = {
    string: { type: "string", required: true },
    number: { type: "number", required: true },
    boolean: { type: "boolean", required: true },
    date: { type: "date", required: true },
    email: { type: "email", required: true },
    float: { type: "float", required: true },
    jwt: { type: "jwt", required: true },
    object: {
        type: "object", required: true, $_data: {
            name: { type: "string", required: true },
            age: "number"
        }
    },
    array: {
        type: "array", required: true, $_data: [
            { name: { type: "string", required: true }, age: "number" }
        ]
    }
}


test("Expect a Failure: Test all avalble types but with data not specified", () => {
    expect(
        new Schema(types).validate()
    ).toEqual({
        error: {
            string: { required: '"string" field is required!' },
            number: { required: '"number" field is required!' },
            boolean: { required: '"boolean" field is required!' },
            date: { required: '"date" field is required!' },
            email: { required: '"email" field is required!' },
            float: { required: '"float" field is required!' },
            jwt: { required: '"jwt" field is required!' },
            object: { required: '"object" field is required!' },
            array: { required: '"array" field is required!' }
        },
        isValid: false,
        data: null
    })
})


test("Expect a Failure: removed a field from the data.object to see how it's handled", () => {
    expect(
        new Schema(types).validate({
            string: "Testing this field",
            number: 45,
            boolean: 56 > 6,
            date: "17 October 2008",
            email: "emailing@mail.com",
            float: 45.4,
            jwt: "gdff.kf.kg",
            object: {}
        })
    ).toEqual({
        error: {
            object: { name: { required: '"name" field is required!' } },
            array: { required: '"array" field is required!' }
        },
        isValid: false,
        data: null
    })
})


test("Expect a Success: insert one item in array", () => {
    expect(
        new Schema(types).validate({
            string: "Testing this field",
            number: 45,
            boolean: 56 > 6,
            date: "17 October 2008",
            email: "emailing@mail.com",
            float: 45.4,
            jwt: "gdff.kf.kg",
            object: { name: "Paul" },
            array: [{ name: "testing" }]
        })
    ).toEqual({
        error: null,
        isValid: true,
        data: {
            string: 'Testing this field',
            number: 45,
            boolean: true,
            date: '17 October 2008',
            email: 'emailing@mail.com',
            float: 45.4,
            jwt: 'gdff.kf.kg',
            object: { name: 'Paul' },
            array: [{ name: 'testing' }]
        }
    })
})

test("Expect a Success: insert no item in array", () => {
    expect(
        new Schema(types).validate({
            string: "Testing this field",
            number: 45,
            boolean: 56 > 6,
            date: "17 October 2008",
            email: "emailing@mail.com",
            float: 45.4,
            jwt: "gdff.kf.kg",
            object: { name: "Paul" },
            array: []
        })
    ).toEqual({
        error: null,
        isValid: true,
        data: {
            string: 'Testing this field',
            number: 45,
            boolean: true,
            date: '17 October 2008',
            email: 'emailing@mail.com',
            float: 45.4,
            jwt: 'gdff.kf.kg',
            object: { name: 'Paul' },
            array: []
        }
    })
})

test("Expect a Fail: This is what happens when you use a whole number on a float type", () => {
    expect(
        new Schema(types).validate({
            string: "Testing this field",
            number: 45,
            boolean: 56 > 6,
            date: "17 October 2008",
            email: "emailing@mail.com",
            float: 45,
            jwt: "gdff.kf.kg",
            object: { name: "Paul" },
            array: []
        })
    ).toEqual({
        error: { float: { type: '"float" is not a valid FLOAT' } },
        isValid: false,
        data: null
    })
})

