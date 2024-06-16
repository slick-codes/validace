

class Types {
    constructor() {
        this.types = ["string", "number", "float", "boolean", "array", "object", "date", "email", "jwt"]
    }

    isEmail(email) {
        // check if email is a string 
        if (typeof email !== "string") return false
        // Define the regular expression pattern for a valid email address
        const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        // Use the test() method to check if the email matches the pattern
        return pattern.test(email);
    }

    isString(string) {
        return typeof string === 'string'
    }

    isNumber(numb) {
        return typeof numb === 'number'
    }

    isBoolean(bool) {
        return typeof bool === 'boolean'
    }

    isArray(array) {
        return Array.isArray(array)
    }
    isObject(object) {
        return typeof object === 'object' && object !== null && !Array.isArray(object)
    }

    isFloat(number) {
        if (typeof number !== 'number') return false;
        // check if the vale is a floating point number 
        return Number.isFinite(number) && !Number.isInteger(number)
    }

    isDate(value) {
        const result = String(new Date(value))
        return result !== 'Invalid Date'
    }

    isJWT(token) {
        if (typeof token !== 'string') {
            return false;
        }

        const parts = token.split('.');

        // Check if the token has three parts
        if (parts.length !== 3) {
            return false;
        }

        // Check if each part is a valid Base64Url encoding
        const isBase64Url = (str) => {
            try {
                atob(str.replace(/-/g, '+').replace(/_/g, '/'));
                return true;
            } catch (e) {
                return false;
            }
        };

        return parts.every(isBase64Url);
    }
}

module.exports = Types