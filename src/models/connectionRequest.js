const mongoose = require("mongoose");

const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Interested", "Ignored", "Accepted", "Rejected"],
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
  if (!this.isNew){
    this.dateUpdated = new Date(Date.now());
  }
});


module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
