const Schema = require("./../../src/");

const options = {
    preventUnregisteredKeys: true,
};

module.exports.loginForm = new Schema(
    {
        password: {
            type: "string",
            required: true,
            maxLength: 20,
            minLength: 8,
        },
        email: {
            type: "email",
            required: true,
        },
    },
    options
);

module.exports.signupSchema = new Schema(
    {
        firstName: {
            type: "string",
            required: true,
        },
        lastName: {
            type: "string",
            required: true,
        },
        password: {
            type: "string",
            maxLength: 20,
            minLength: 8,
            required: true,
        },
        username: {
            type: "string",
            default: "anonymous",
        },
        email: {
            type: "email",
            required: true,
        },
        hobbies: {
            type: "array",
            required: true,
        },
        skinTone: {
            type: "string",
            toLower: true,
            enum: ["black", "white", "brown"],
        },
        height: {
            type: "float",
        },
        gender: {
            type: "string",
            required: true,
            toLower: true,
            enum: ["male", "female"],
        },
        dateOfBirth: {
            type: "date",
            required: true,
        },
    },
    options
);

module.exports.musicObject = new Schema(
    {
        name: {
            type: "string",
            required: true,
        },
        songs: {
            type: "array",
            required: true,
        },
        date: {
            type: "date",
            required: true,
        },
    },
    options
);

module.exports.booleanCheck = new Schema({
    isTall: {
        type: "boolean",
        required: true
    }
})