const express = require("express");
const connectDB = require("./configs/database");
const User = require("./models/user");
const user = require("./models/user");

const app = express();

app.use(express.json());

function validateReqBody(req) {
  const isValidBody =
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length !== 0;

  if (isValidBody) {
    return req.body;
  }
  throw new Error("invalid body");
}

app.post("/signup", async (req, res) => {
  try {
    const data = validateReqBody(req);

    if ((await User.find({ email: data.email })).length !== 0) {
      res.status(400).send("user already exist with this emai");
    }

    const user = await User.create(data);

    res.send("user created successfully with");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const data = validateReqBody(req);
    const email = data.email;
    const users = await User.find({ email });

    if (users.length === 0) {
      res.status(404).send("User not found !");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong - check req body");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const data = validateReqBody(req);
    const userId = data.id;
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    if (!user) {
      res.status(404).send("user not exist with entered userId");
    } else {
      res.send("user deleted successfully !");
    }
  } catch (err) {
    res.status(400).send("Something went wrong:   " + err.message);
  }
});

app.patch("/user", async (req, res) => {
  try {
    const data = validateReqBody(req);
    const userId = data.id;

    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
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
