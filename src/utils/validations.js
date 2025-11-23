const User = require("../models/user");
const userSchemaObject = require("../models/userSchemaObject");

const validateReqBody = (req) => {
  // checking req body whether it is empty
  const isValidBody =
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length !== 0;

  if (!isValidBody) {
    throw new Error("ERROR: req body is empty");
  }

  //checking all the keys from the req body object are present in userSchema
  const allowedFields = Object.keys(userSchemaObject);
  const reqBodyFields = Object.keys(req.body);
  const invalidFields = reqBodyFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error("Invalid key ERROR: check req body");
  }
};

//To check whether the user email is already exist in the DB
const validateEmail = async (req) => {
  const email = req?.body?.email?.trim() ?? "";
  const isEmailExist = !!(await User.findOne({ email })); // if no records with the given email findOne() will return `null`

  if (isEmailExist) {
    throw new Error("ERROR: user already exist with this email");
  }
};

const validatePassword = (password) => {
  if (password === "") {
    throw new Error("ERROR: Password is required");
  } else if (password.length < 8) {
    throw new Error("ERROR: Password should be minimum 8 characters length");
  } else if (!/[A-Z]/.test(password)) {
    throw new Error(
      "ERROR: Password must be contains atleast 1 uppercase letter"
    );
  } else if (!/[a-z]/.test(password)) {
    throw new Error(
      "ERROR: Password must be contains atleast 1 lowercase letter"
    );
  } else if (!/[0-9]/.test(password)) {
    throw new Error("ERROR: Password must be contains atleast 1 number");
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error("ERROR: Password must be contains 1 special character");
  }
};

const validateUser = async (req) => {
  const userId = req?.params?.id ?? "";
  console.log("userId: " + userId);

  const isUserExist = !!(await User.findById(userId)); // if userId is empty or no user exist with userId - findById will return `null`

  if (!isUserExist) {
    throw new Error(
      `ERROR: Can not ${req.method} - user not exist with Id: ` + userId
    );
  }
};

module.exports = {
  validateReqBody,
  validateEmail,
  validateUser,
  validatePassword,
};
