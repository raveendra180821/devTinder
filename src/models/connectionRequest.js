const mongoose = require("mongoose");

const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      required: true,
    },
    dateUpdated: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: "dateCreated",
      updatedAt: false,
    },
  },
);

connectionRequestSchema.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You can not send request to yourself");
  }
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
