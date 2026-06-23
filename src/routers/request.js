const express = require("express");
const User = require('../models/user')

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post("/req/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const user = req.user;
    const fromUserId = user._id;

    const toUser = await User.findById({_id: toUserId});

    if(!toUser){
      throw new Error('Cannot send a request to Invalid user')
    }

    const sendConnectionRequest = ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    sendConnectionRequest.save()
    res.send('Request Sent Successfully !')
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = requestRouter;
