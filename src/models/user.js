const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 20,
    trim: true,
    required: [true, "firstName is required"],
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email is required"],
    validate: function (v){
      if (!validator.isEmail(v)){
        throw new Error("Invalid Email address")
      }else{
        return true
      }

    },
    trim: true
  },
  password: {
    type: String,
    trim: true,
    required: [true, "password is required"],
    validate: function(v){
      
    }
  },
  age: {
    type: Number,
    trim: true,
    min: 18,
    required: [true, "Age is required"],
  },
  gender: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ["male", "female", "other"],
    required: [true, "Gender is required"],
  },
});

module.exports = mongoose.model("User", userSchema);
