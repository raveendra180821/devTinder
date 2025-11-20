const mongoose = require("mongoose");
const userSchemaObject = require('./userSchema')
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema(userSchemaObject,{
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
