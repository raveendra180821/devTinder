const validator = require('validator')
const User = require('../models/user')

const checkIsPasswordStrong = (password) => {
    if (!(password.length >= 8)){
        throw new Error("Password length should be 8 characters")
    }
    else if (!(/[!@#$%^&*]/.test(password))){
        throw new Error("Password must contain 1 special character")
    }
    else if (!(/[0-9]/.test(password))){
        throw new Error("Password must contain atleast 1 numeric")
    }
    else if (!(/[A-Z]/.test(password))){
        throw new Error("Password must contain atleast 1 uppercase")
    }
    else if (!(/[a-z]/.test(password))){
        throw new Error("Password must contain atleast 1 lowercase")
    }
}

const validateSignupData = (body) => {
    const bodyFields = Object.keys(body)
    const bodyLength = bodyFields.length

    // checking whether recieved a valid fields from body
    const hasBodyValidFields = bodyFields.every((i) => {
        const validBodyFields = ["firstName", "lastName", "email", "password", "age", "gender"]
        return validBodyFields.includes(i)
    })
    
    if (bodyLength === 0 || !hasBodyValidFields ) {
        throw new Error("Invalid request body")
    }
    else if (!bodyFields.includes("firstName") || body.firstName.length === 0){
        throw new Error("firstName is required")
    }
    else if (!(body.firstName.length >= 4)){
        throw new Error("firstName should be more than 5 characters")
    }
    else if (!bodyFields.includes("lastName") || body.lastName.length === 0){
        throw new Error("LastName is required")
    }
    else if (!(body.lastName.length >= 3)){
        throw new Error("LastName should be more than 5 characters")
    }
    else if (!bodyFields.includes("password") || body.password.length === 0){
        throw new Error("Password is required")
    }
    else if (body.password.length > 0) {
        checkIsPasswordStrong(body.password)
    }
    else if (!validator.isEmail(body.email)){
        throw new Error("Enter a valid email")
    }
}

const checkIsUserAlreadyExist = async (userInputEmail) => {
    const user = await User.findOne({email: userInputEmail})

    if (user){
        throw new Error("User is already exist. Please login !")
    }  
}

const validateProfileEditData = (req) => {
    const {body} = req

    if (!body){
        throw new Error('Invalid Edit Request')
    }

    const allowedEditFields = ["firstName", "lastName", "email", "skills", "photoUrl"]

    for (let field in body){
        if (allowedEditFields.includes(field)){
            continue
        }
        throw new Error(`'${field}'`+ " is not allowed to edit")
    }
}

module.exports = {validateSignupData, checkIsUserAlreadyExist, validateProfileEditData, checkIsPasswordStrong};