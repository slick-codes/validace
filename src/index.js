const Types = require("./types")




class Schema extends Types {

    #nestedScheme = undefined
    #error = {}

    constructor(schema, config) {
        super()
        this.schema = schema ?? {}
        // The following allows processes the configuration parsed in the constructor function
        if (config) this.config(config)

    }

    config(config) {
        this.configuration = {
            allowUnregisteredKeys: false,
            allowEmptyString: true,
            hooks: { onError: null, onSuccess: null },
            ...config
        }
    }

    validate(data = {}, callback) {
        let schema = this.#nestedScheme ?? this.schema
        let error = {}

        // prefix schema to obj if it's an array was parsed in 
        if (this.isArray(schema)) {
            schema = {
                $_array: {
                    type: "array",
                    required: true,
                    $_data: [schema[0]]
                }
            }
            data = { $_array: data }
        }

        const schemaKeys = Object.keys(schema)

        // Configuration --------------------------------------------------
        // Prevent users from using more keys than the Schema allows (preventUnregisteredKeys)
        error = this.#allowUnregisteredKeys(error, data, schema)

        // validate configuration.allowEmptyString 
        error = this.#allowEmptyString(error, data, schema)

        for (let sKey of schemaKeys) {
            // this checks if {type: string} or it's just key: type 
            let sData = typeof schema[sKey] === 'string' ? { type: schema[sKey] } : { ...schema[sKey] }

            // Custom Error Messages 
            let customErr = {}
            Object.keys(sData).forEach(key => {
                if (Array.isArray(sData[key]) && key !== 'enum' && key !== "$_data") {
                    customErr = this.#createErr(customErr, data[sKey], key, sKey, sData)
                    sData = { ...sData, [key]: sData[key][0] }
                }
            })

            /* 
                MODIFIERS 
                modifiers are set at the top to ensure that values get's modified before it get's checked
            */
            // TRIM: handle text triming 
            if (typeof data[sKey] === 'string' && sData.trim) data[sKey] = data[sKey].trim()
            else if (typeof data[sKey] === 'string' && sData.trimEnd) data[sKey] = data[sKey].trimEnd()
            else if (typeof data[sKey] === 'string' && sData.trimStart) data[sKey] = data[sKey].trimStart()
            // CASEING: Increase of Decrease the case of the text 
            if (typeof data[sKey] === "string" && sKey.lowerCase) data[sKey] = data[sKey].toLowerCase()
            if (typeof data[sKey] === "string" && sKey.upperCase) data[sKey] = data[sKey].toUpperCase()
            // DATIFY: Convert string date to a valid date object 
            if (typeof data[sKey] === 'string' && sData.type === 'date' && sData.datify === true) data[sKey] = new Date(data[sKey])
            // DEFAULT: Set default value 
            if (!data[sKey] && typeof sData.default === "boolean") data[sKey] = sData.default
            // MODIFY VALUE: This is a function that helps us modify the vlue of the specified field
            if (typeof sData.modifier === 'function') data[sKey] = sData.modifier(data[sKey])

            /* END OF MODIFIERS */

            // this handles the type check
            const isTypeSupported = this.types.includes(sData.type?.toLowerCase())
            const dKeyExist = Object.keys(data).includes(sKey)
            if (!sData.type) throw new Error(`${sKey} type is not assigned`) // throw an error if field does not have a type key
            else if (!isTypeSupported) throw new Error(`${sKey} type is not assigned`) // throw an error if type is supported
            else if (dKeyExist && !this.#typeValidation(sData.type, data[sKey]))
                error = this.#setError(sKey, error, {
                    type: customErr.type ?? `"${sKey}" is not a valid ${sData.type.toUpperCase()}`
                })

            // handle the required fields 
            //  check if field is required  ----||---- check if array is required but value was not asigned
            if ((!dKeyExist && sData.required) || (sData.required && sData.type === 'array' && !data[sKey]))
                error = this.#setError(sKey, error, {
                    required: customErr.required ?? `"${sKey}" field is required!`
                })

            // Validate nested schema object
            if (sData.type === 'object' && sData.$_data && data[sKey]) {
                this.#nestedScheme = sData.$_data

                const result = this.validate(data[sKey])
                if (Object.keys(result.error ?? {}).length > 0)
                    error = { ...error, [sKey]: { ...result.error } }
            }

            // validate nested schema array of object 
            if (sData.type === 'array') {
                if (sData.$_data && this.isArray(sData.$_data)) {
                    // check if an array was parsed and parse an empy array if that's the case
                    data[sKey] = this.isArray(data[sKey]) ? data[sKey] : []

                    for (let object of data[sKey]) {
                        this.#nestedScheme = sData.$_data[0]
                        const result = this.validate(object)
                        if (Object.keys(result.error || {}).length > 0)
                            error = { ...error, [sKey]: [result.error] }
                    }
                }
                this.#nestedScheme = null
            }

            // check if data matches the regex
            if (sData.match && !sData.match.test(data[sKey]))
                error = this.#setError(sKey, error, {
                    match: customErr.match ?? `"${sKey}" does not match the regex`
                })

            // check if enum parsed in was actually an array 
            if (sData.enum && !Array.isArray(sData.enum))
                throw new Error(`Schema Error: "${sKey}.enum should be an array!`)

            // check if data matches the enum 
            if (dKeyExist && sData.enum && !sData.enum.includes(data[sKey]))
                error = this.#setError(sKey, error, {
                    enum: `${sKey} should be an enum of (${sData.enum.join(' | ')})`
                })

            // check if the max and min Length is actually a whole number
            if ((sData.maxLength && this.isFloat(sData.maxLength)) || (sData.maxLength && typeof sData.maxLength !== 'number')) throw new Error("maxLength needs to be whole number")
            if ((sData.minLength && this.isFloat(sData.minLength)) || (sData.minLength && typeof sData.minLength !== 'number')) throw new Error("minLength needs to be whole number")

            // Handle minLength && maxLength
            if (sData.maxLength && data[sKey].length > sData.maxLength)
                error = this.#setError(sKey, error, { // error handling
                    maxLength: customErr.maxLength ?? ` ${sKey} should be ${sData.maxLength} ${sData.type === 'array' ? 'items' : "characters"} or below. `
                })

            // Handle minLength && maxLength
            if (sData.minLength && data[sKey]?.length < sData.minLength)
                error = this.#setError(sKey, error, { // error handling
                    minLength: customErr.minLength ?? `${sKey} should be ${sData.minLength} ${sData.type === 'array' ? 'items' : "characters"} or above`
                })

            // VALIDATE METHOD: handle the validate method
            if (typeof sData.validate === 'function') {
                const result = sData.validate(data[sKey])
                if (!result.valid)
                    error = this.#setError(sKey, error, {
                        validate: result.message ? this.#setPlaceholder(result.message, { value: data[sKey], property: "validate", key: sKey }) : "validate method error!"
                    })
            }

            // FUNC METHOD: handle the func method
            if (typeof sData.func === 'function') {
                sData.func({
                    error: error[sKeys] || null,
                    errors: Object.keys(error).length ? error : null,
                    key: sKey,
                    value: data[sKey],
                    message: Object.values(err[sKey] || {}),
                    valid: Object.keys(error[sKey] || {}).length === 0
                })
            }

            // EVENTS: handle events here

        }

        return {
            error: Object.keys(error).length === 0 ? null : error["$_array"] ?? error,
            isValid: Object.keys(error).length === 0,
            data: Object.keys(error).length === 0 ? data["$_array"] ?? data : null
        }
    }

    #setError(key, error, newError) {
        this.error = error[key] ? { ...error, [key]: { ...error[key], ...newError } } : { ...error, [key]: newError }
        return this.error
    }
    #createErr(customErr, value, property, key, schema) {
        return {
            ...customErr,
            [`${property}`]: this.#setPlaceholder(schema[property][1], {
                value, property, key
            })
        }
    }

    #allowEmptyString(error, data, schema) {
        for (let keyValue of Object.entries(data)) {

            let schemaValue = schema[keyValue[0]]

            if (
                schemaValue &&
                ["string"].includes(schemaValue.type.toLowerCase()) &&
                (
                    (schemaValue.allowEmptyString === undefined && !this.configuration.allowEmptyString) ||
                    (schemaValue.allowEmptyString === false || !this.configuration.allowEmptyString)
                )
            ) {
                if (keyValue[1] === "")
                    error = this.#setError(keyValue[0], error, {
                        emptyString: `"${keyValue[0]}" field cannot be empty!`
                    })
            }
        }

        return error
    }

    #allowUnregisteredKeys(error, data, schema) {
        const schemaKeys = Object.keys(schema)
        if (!this.configuration.allowUnregisteredKeys)
            for (let key of Object.keys(data))
                if (!schemaKeys.includes(key))
                    error = this.#setError(key, error, {
                        unRegisteredKey: `"${key}" is not registered on the schema!`
                    })

        return error
    }

    #setPlaceholder(string, placeholder) {
        return string.replace(/%value%/g, placeholder.value || "")
            .replace(/%key%/g, placeholder.key || "")
            .replace(/%property%/g, placeholder.property || "")
    }

    #typeValidation(type, value) {
        if (typeof type !== 'string') new Error("Type should be of type string")
        type = type.toLowerCase();
        switch (type) {
            case "string": return this.isString(value);
            case "number": return this.isNumber(value);
            case "array": return this.isArray(value);
            case "float": return this.isFloat(value);
            case "jwt": return this.isJWT(value);
            case "date": return this.isDate(value);
            case "object": return this.isObject(value);
            case "email": return this.isEmail(value);
            case "boolean": return this.isBoolean(value);
        }
    }
}


if (typeof exports !== "undefined") {
    exports.default = Schema;
    module.exports = exports.default;
    module.exports.default = exports.default;
}
