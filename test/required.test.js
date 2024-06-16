const Schema = require("./../src/index")



const book = {
    name: { type: "string", required: true },
    publishedDate: { type: "date", required: true, datify: true },
    soldBooks: { type: "number", required: true },
    author: {
        type: "object",
        required: true,
        $_data: {
            firstName: { type: "string", required: true },
            lastName: { type: "string", required: false },
            email: { type: "email", required: true },
            hobbies: { type: "array", required: true }
        }
    }
}


test("Expect a Success: this test is to determin if the required function is working as expected", () => {
    expect(
        new Schema(book).validate({
            name: "Harry Potter",
            publishedDate: "31 July 1965",
            soldBooks: 594,
            author: {
                firstName: "J. K. Rowling",
                email: "hartpaulisimo@gmail.com",
                hobbies: []
            }
        })
    ).toEqual(
        {
            error: null,
            isValid: true,
            data: {
                name: 'Harry Potter',
                publishedDate: new Date("1965-07-30T23:00:00.000Z"),
                soldBooks: 594,
                author: {
                    firstName: 'J. K. Rowling',
                    email: 'hartpaulisimo@gmail.com',
                    hobbies: []
                }
            }
        })
})


test("Expect a Fail: check if email is valid", () => {
    expect(
        new Schema(book).validate({
            name: "Harry Potter",
            soldBooks: 594,
            author: {
                firstName: "J. K. Rowling",
                email: "hartpaulisimo@gmail.com",
                hobbies: []
            }
        })
    ).toEqual({
        error: { publishedDate: { required: '"publishedDate" field is required!' } },
        isValid: false,
        data: null
    })
})


test("Expect a Fail: see how it handles alot of absent required field", () => {
    expect(
        new Schema(book).validate({
            name: "Harry Potter",
            // publishedDate: "31 July 1965",
            soldBooks: 594,
            author: {
                firstName: "J. K. Rowling",
                // email: "hartpaulisimo@gmail.com",
                // hobbies: []
            }
        })
    ).toEqual({
        error: {
            publishedDate: { required: '"publishedDate" field is required!' },
            author: {
                email: { required: '"email" field is required!' },
                hobbies: { required: '"hobbies" field is required!' }
            }
        },
        isValid: false,
        data: null
    })
})


test("Expect a Fail: remove all the data content and see how it handles it", () => {
    expect(
        new Schema(book).validate()
    ).toEqual({
        error: {
            name: { required: '"name" field is required!' },
            publishedDate: { required: '"publishedDate" field is required!' },
            soldBooks: { required: '"soldBooks" field is required!' },
            author: { required: '"author" field is required!' }
        },
        isValid: false,
        data: null
    })
})


test("Expect a Fail: this is what happened when an object is empty", () => {
    expect(
        new Schema(book).validate({
            name: "Harry Potter",
            publishedDate: "31 July 1965",
            soldBooks: 594,
            author: {
            }
        })
    ).toEqual({
        error: {
            author: {
                firstName: { required: '"firstName" field is required!' },
                email: { required: '"email" field is required!' },
                hobbies: { required: '"hobbies" field is required!' }
            }
        },
        isValid: false,
        data: null
    })
})
