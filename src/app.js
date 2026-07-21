const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const connectDB = require('./config/db');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/request');
const userRouter = require('./routers/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter)

connectDB()
.then(() => {
    console.log('Database connection established');
})
.then(() => {
    app.listen(3000, () => {
        console.log("Server is up and running on port 3000");
    })
})
.catch((e) => {
    console.log(`Error: ${e.message}`);
});

