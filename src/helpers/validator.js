const User = require('../models/user')

const checkIsPasswordStrong = (password) => {
    if (!(password.length >= 8)) {
        throw new Error("Password must be at least 8 characters")
    }
    else if (!(/[!@#$%^&*]/.test(password))) {
        throw new Error("Password must contain 1 special character")
    }
    else if (!(/[0-9]/.test(password))) {
        throw new Error("Password must contain atleast 1 numeric")
    }
    else if (!(/[A-Z]/.test(password))) {
        throw new Error("Password must contain atleast 1 uppercase")
    }
    else if (!(/[a-z]/.test(password))) {
        throw new Error("Password must contain atleast 1 lowercase")
    }
}

const validateSignupData = (body) => {
    if (body === null || typeof body !== "object" || Array.isArray(body)){
        throw new Error("Invalid request body")
    }

    const bodyFieldsArray = Object.keys(body)

    if (bodyFieldsArray.length === 0){
        throw new Error("Expecting required data to signup")
    }

    // checking whether recieved an invalid fields from body
    let invalidField;

    const hasBodyValidFields = bodyFieldsArray.every((i) => {
        const validBodyFields = ["firstName", "lastName", "email", "password", "age", "gender"]
        if (!validBodyFields.includes(i)) {
            invalidField = i
            return false
        }
        return true
    })

    if (!hasBodyValidFields){
        throw new Error(`Do not allow '${invalidField}' while sign up`)
    }

    if (bodyFieldsArray.includes("password")){
        checkIsPasswordStrong(body.password)
    }else{
        throw new Error("Password is required")
    }

    
}

const checkIsUserAlreadyExist = async (userInputEmail) => {
    const user = await User.findOne({ email: userInputEmail })

    if (user) {
        throw new Error("User is already exist. Please login !")
    }
}

const validateProfileEditData = (req) => {
    const { body } = req

    if (!body) {
        throw new Error('Invalid Edit Request')
    }

    const allowedEditFields = ["firstName", "lastName", "email", "skills", "photoUrl"]

    for (let field in body) {
        if (allowedEditFields.includes(field)) {
            continue
        }
        throw new Error(`'${field}'` + " is not allowed to edit")
    }
}

const validateUpdatePasswordReqBody = (req) => {

    if (!req.body){
        throw new Error("Expecting user to enter required data")
    }

    const bodyFields = Object.keys(req.body)

    let invalidField;
    const isBodyValid = bodyFields.every(field => {
        const allowedBodyFileds = ["userCurrentInputPassword", "userNewInputPassword"]
        if (!allowedBodyFileds.includes(field)) {
            invalidField = field
            return false
        }
        return true
    })

    if (!isBodyValid) {
        throw new Error(
            `Do not allow "${invalidField}" while updating password`
        )
    }
}

module.exports = { validateSignupData, checkIsUserAlreadyExist, validateProfileEditData, checkIsPasswordStrong, validateUpdatePasswordReqBody };