const express = require("express");
const connectDB = require("./config/database")

const app = express();

connectDB()
    .then(() => {
        console.log("Database connection established !")
        app.listen(3000, () => {
            console.log("Server Started Listening The Requests")
        })
    })
    .catch((error) => {
        console.log(`Database connection failed with - ${error}`)
    }) 