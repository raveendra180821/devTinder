const mongoose = require("mongoose");
const userSchemaObject = require('./userSchemaObject')

const { Schema } = mongoose;

const userSchema = new Schema(userSchemaObject,{
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);