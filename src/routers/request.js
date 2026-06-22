const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post("/req/send/:status/:toUser", userAuth, (req, res) => {
  try {
    const { status, toUser } = req.params;
    const user = req.user;
    const fromUser = user._id;

    const sendConnectionRequest = ConnectionRequest({
      fromUser,
      toUser,
      status,
    });

    sendConnectionRequest.save()
  } catch (e) {
    res.status(400).send("Error: Unable to send request - " + e.message);
  }
});

module.exports = requestRouter;
