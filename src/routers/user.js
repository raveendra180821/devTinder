const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');

const POPULATE_DATA = ["firstName", "lastName"]

userRouter.get(
    '/user/requests/recieved',
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            const requests = await connectionRequest.find({
                toUserId: loggedInUser,
                status: "interested"
            }).populate("fromUserId", ["firstName", "lastName"]);

            res.json({
                message: "Successfully fetched all the pending requests recieved",
                data: requests
            });
        }
        catch (e) {
            res.status(400).send("ERROR: " + e.message);
        }
    })

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connections = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("fromUserId", POPULATE_DATA)
        .populate("toUserId", POPULATE_DATA)

        const data = connections.map(connection => {
            if (connection.fromUserId._id.equals(loggedInUser._id)){
                return connection.toUserId
            }
            return connection.fromUserId
        })

        res.json({
            message: "Connections fetched successfully",
            data
        })
    }
    catch (e) {
        res.status(400).semd("ERROR " + e.message)
    }


})

module.exports = userRouter;