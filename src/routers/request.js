const express = require("express");
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/req/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //validate send req statuses
      const allowedSendRequestStatuses = ["interested", "ignored"];
      if (!allowedSendRequestStatuses.includes(status)) {
        throw new Error(`"${status}" is invalid status to send a request`);
      }

      // validating toUser
      const toUser = await User.findById({ _id: toUserId });
      if (!toUser) {
        throw new Error("Cannot send a request to Invalid user");
      }

      // check if is there any existing connection already
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("connection request already exist");
      }

      const data = await ConnectionRequest.create({
        fromUserId,
        toUserId,
        status,
      });

      const message =
        status === "interested"
          ? `${req.user.firstName} is ${status} in ${toUser.firstName}`
          : `${req.user.firstName} is ${status} ${toUser.firstName}`;

      res.json({
        message,
        data,
      });
    } catch (e) {
      res.status(400).send("Error: " + e.message);
    }
  },
);

module.exports = requestRouter;
