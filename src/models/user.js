const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minLength: [3, "First name must be at least 3 characters long"],
    maxLength: [20, "First name is longer than the maximum allowed length (20)"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minLength: [2, "Last name must be at least 3 characters long"],
    maxLength: [20, "Last name is longer than the maximum allowed length (20)"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    maxLength: [50, "Email is longer than the maximum allowed length (50)"],
    validate: [
      {
        validator: (email) => (email.includes("@")),
        message: "Email should contain '@'"
      },
      {
        validator: (email) => (email.includes(".com")),
        message: "Email should contain '.com'"
      }
    ]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [18, "You must be at least 18 years old"]
  },
  gender: {
    type: String,
    lowercase: true,
    enum: {
      values: ["male", "female", "other"],
      message: "'{VALUE}' is not a valid gender"
    }
  },
  skills: {
    type: Array,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  dateUpdated: {
    type: Date
  }
});

// Schema middleware
userSchema.pre("save", function () {
  if (!this.isNew) {
    this.dateUpdated = new Date(Date.now())
  }
})


// Schema Methods
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, "Ravi@123", {
    expiresIn: "1h",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordEnteredByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordEnteredByUser,
    passwordHash,
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
