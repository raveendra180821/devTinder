const mongoose = require("mongoose");

const {Schema} = mongoose;


const userSchema = new Schema({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        trim: true,
        required: [true, "firstName is required"]
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        trim: true
    },
    email: {
        type: String,
        lowerCase: true,
        unique: true,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "password is required"],
        validate: [
            {
                validator: v => v.length >= 8,
                message: "Password must be atleast 8 characters long"
            },
            {
                validator: v => /[A-Z]/.test(v),
                message: "Password must contain at least one uppercase letter"
            }
        ]
    },
    age: {
        type: Number,
        min: 18,
        required: [true, "Age is required"]
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    }
})

module.exports = mongoose.model("User", userSchema);

