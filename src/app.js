const express = require("express");
const connectDB = require("./configs/database");
const User = require("./models/user");
const userSchemaObject = require("./models/userSchemaObject");

const app = express();

app.use(express.json());

function validateReqBody(req, res, next) {
  const isValidBody =
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length !== 0;

  if (!isValidBody) {
    return res.status(400).send("Invalid request - body should not be empty");
  }
  const allowedFields = Object.keys(userSchemaObject);
  const reqBodyFields = Object.keys(req.body);
  const invalidFields = reqBodyFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (!(invalidFields.length === 0)) {
    return res.send("Invalid key: " + invalidFields[0]);
  }
  next();
}

async function checkIsEmailAlreadyExist(req, res, next) {
  const email = req?.body?.email?.trim() ?? "";
  const isEmailExist = !!(await User.findOne({ email })); // if no records with the given email findOne() will return `null`

  if (isEmailExist) {
    return res.status(400).send("user already exist with this email");
  }
  next();
}

async function validateUser(req, res, next) {
  console.log(req);
  try {
    const userId = req?.params?.id ?? "";
    console.log("userId: " + userId);

    const isUserExist = !!(await User.findById(userId)); // if userId is empty or no user exist with userId - findById will return `null`

    if (!isUserExist) {
      return res
        .status(400)
        .send(`Can not ${req.method} - user not exist with Id: ` + userId);
    }
    next();
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send(`Can not ${req.method} - Invalid user Id`);
    }
  }
}

app.post(
  "/signup",
  validateReqBody,
  checkIsEmailAlreadyExist,
  async (req, res) => {
    const data = req.body;

    try {
      //creating new document into users collection under devTinder DB
      const user = await User.create(data);
      console.log(user);

      res.send("user created successfully with");
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

app.get("/user/:email", async (req, res) => {
  try {
    const email = req?.params?.email ?? "";
    const users = await User.find({ email }); // if email is empty or no record exist with the email, find() will returns []

    if (users.length === 0) {
      res.status(404).send("User not found !");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong - check req body");
  }
});

app.delete("/user/:id", validateUser, async (req, res) => {
  try {
    const userId = req?.params?.id ?? "";
    await User.findByIdAndDelete(userId);
    res.send("user deleted successfully !");
  } catch (err) {
    res.status(400).send("Something went wrong:   " + err.message);
  }
});

app.patch(
  "/user/:id",
  validateReqBody,
  validateUser,
  checkIsEmailAlreadyExist,
  async (req, res) => {
    try {
      const data = req.body;
      const userId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
        returnDocument: "after",
        runValidators: true,
        strict: "throw",
      });

      console.log(data);
      if (!updatedUser) {
        res.status(400).send("user not found with the given userId");
      } else {
        res.send("user updated successfully");
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

connectDB()
  .then(() => {
    console.log("Database connection established !");
    app.listen(3000, () => {
      console.log("Server Started Listening The Requests");
    });
  })
  .catch((error) => {
    console.log(`Database connection failed with - ${error.message}`);
  });
