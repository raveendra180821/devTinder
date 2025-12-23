const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/database");
const User = require("./models/user");
const { userAuth } = require("./utils/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
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
      throw new Error("Invalid user");
    }

    // verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      // send token in response via cookies
      const token = jwt.sign({ id: user._id }, "Ravi@G12%");
      res.cookie("token", token);

      res.send("login successfull !!!");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("ERROR: Token not found");
    } else {
      const decodedToken = jwt.verify(token, "Ravi@G12%");

      const { id } = decodedToken;

      const user = await User.findOne({ _id: id }).select(
        "-createdAt -updatedAt -__v"
      );
      console.log(user);
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/sendConnectionReq", userAuth, async (req, res) => {
  const {user} = req

  res.send(user.firstName + " sent Connection Request");
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
