const validator = require("validator");

const userSchemaObject = {
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 20,
    trim: true,
    required: [true, "firstName is required"],
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email is required"],
    validate: function (v) {
      if (!validator.isEmail(v)) {
        throw new Error("Invalid Email address");
      } else {
        return true;
      }
    },
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "password is required"],
    validate: [
      {
        validator: (v) => /[A-Z]/.test(v),
        message: "Password must be contains atleast 1 uppercase letter",
      },
      {
        validator: (v) => /[a-z]/.test(v),
        message: "Password must be contains atleast 1 lowercase letter",
      },
      {
        validator: (v) => /[0-9]/.test(v),
        message: "Password must be contains atleast 1 number",
      },
      {
        validator: (v) => /[^A-Za-z0-9]/.test(v),
        message: "Password must be contains a symbol",
      },
      {
        validator: (v) => v.length > 8,
        message: "Password should be minimum 8 characters length",
      },
    ],
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
    enum: {
      values: ["male", "female", "other"],
      message: "{VALUE} is not valid gender",
    },
    required: [true, "Gender is required"],
  },
  skills: {
    type: [String],
  },
};

module.exports = userSchemaObject;
