const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/database");
const User = require("./models/user");
const {
  validateReqBody,
  validateEmail,
  validateUser,
  validatePassword,
} = require("./utils/validations");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validating the req body
    validateReqBody(req);

    //checking whether email is already exist
    await validateEmail(req);

    const password = req?.body?.password ?? "";
    validatePassword(password);

    // encrypt the password using bcrypt package
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const data = req.body;

    //creating new document into users collection under devTinder DB
    const user = await User.create({ ...data, password: hashedPassword });
    console.log(user);

    res.send("user created successfully with");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req?.body ?? {};

    if (email === undefined) {
      throw new Error("ERROR: Email is required");
    } else if (password === undefined) {
      throw new Error("ERROR: Password is required");
    }

    // get the user from DB using email
    const user = await User.findOne({ email }).select("_id password");
    console.log(user);

    if (user === null) {
      throw new Error("Invalid credentials");
    }

    // verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      // send token in response via cookies
      res.cookie("token", "wehjid65twhbf4738wdfgwju346yewhbdg2u3eyregj");

      res.send("login successfull !!!");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    if (Object.keys(cookies).length === 0) {
      throw new Error("ERROR: Cookie not found");
    } else {
      const {token} = cookies
      res.send("reading cookie!");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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

app.delete("/user/:id", async (req, res) => {
  try {
    const userId = req?.params?.id ?? "";
    await User.findByIdAndDelete(userId);
    res.send("user deleted successfully !");
  } catch (err) {
    res.status(400).send("Something went wrong:   " + err.message);
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    //validating the req body
    validateReqBody(req);

    //checking whether email is already exist
    await validateEmail(req);

    await validateUser(req);

    const data = req.body;
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("user updated successfully");
  } catch (err) {
    err.name === "CastError"
      ? res.status(400).send(`Can not ${req.method} - Invalid user Id`)
      : res.status(400).send(err.message);
  }
});

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
