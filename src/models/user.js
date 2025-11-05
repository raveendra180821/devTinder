const mongoose = require("mongoose");

const {Schema} = mongoose;


const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
}, {collection: "refnums"})

module.exports = mongoose.model("calls", userSchema);

