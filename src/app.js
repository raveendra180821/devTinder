const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express();

app.post("/signup", async (req,res) => {
    const userObj = {
        firstName: "Raveendra",
        lastNae: "Gulivindala",
        email: "raveendra@gulivindala@gmail.com",
        password: "raveendra@123"
    }

    const user = new User(userObj);

    try{
        await user.save()
        res.send("User Saved Successfully !")
    }catch(err){
        res.status(400).send("Error while saving user:" + err.message)
    }

    
});

connectDB()
    .then(() => {
        console.log("Database connection established !")
        app.listen(3000, () => {
            console.log("Server Started Listening The Requests")
        })
    })
    .catch((error) => {
        console.log(`Database connection failed with - ${error.message}`)
    });