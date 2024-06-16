const Schema = require("./../src/index")


const users = [{
    firstName: {
        type: "string",
        required: true
    },
    lastName: "string"
}]



test("Expect a Success: Test array of object", () => {
    expect(
        new Schema(users).validate([
            { firstName: "Bob", lastName: "Samuel" },
            { firstName: "Samuel" },
            { firstName: "John", lastName: "Doe" },
            { firstName: "Timi", lastName: "Tams" }
        ])
    ).toEqual({
        error: null,
        isValid: true,
        data: [
            { firstName: 'Bob', lastName: 'Samuel' },
            { firstName: 'Samuel' },
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Timi', lastName: 'Tams' }
        ]
    })
})


test("Expect a faild: check what happens when i remove a required field form an array of object", () => {
    expect(
        new Schema(users).validate([
            { firstName: "Bob", lastName: "Samuel" },
            { firstName: "Samuel", lastName: "Jackson" },
            { lastName: "Doe" },
            { firstName: "Timi" }
        ])
    ).toEqual({
        error: [{ firstName: { required: '"firstName" field is required!' } }],
        isValid: false,
        data: null
    })
})
