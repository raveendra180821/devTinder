const express = require("express");
const connectDB = require("./configs/database");
const User = require("./models/user");
const user = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const body = req.body;
  console.log(body);

  const user = new User(body);

  if (!body) {
    res.status(400).send("request body is empty");
  } else {
    try {
      await user.save();
      res.send("User Saved Successfully !");
    } catch (err) {
      
      const errName = err.name;
      let value = {}
      for (key in err.errors){
        value[key] = err.errors[key].message
      }
      
      res.status(400).send({[errName]: value});
      //res.status(400).send(err);
    }
  }
});

app.get("/user", async (req, res) => {
  try {
    const email = req.body.email;
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
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    if (!user) {
      res.status(404).send("user not exist with entered userId");
    } else {
      res.send("user deleted successfully !");
    }
  } catch (err) {
    res.status(400).send("Something went wrong:   " + err.name);
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
