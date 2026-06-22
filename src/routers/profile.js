const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEditData,
  checkIsPasswordStrong,
} = require("../helpers/validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    res.status(400).send("ERROR" + e.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);

    const loggedInUser = req.user;

    for (let field in req.body) {
      loggedInUser[field] = req.body[field];
    }

    await loggedInUser.save();

    res.send("You Profile updated successfully");
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const {userCurrentInputPassword, userNewInputPassword} = req.body;

    const user = req.user;

    const isCurrentPasswordValid = await user.validatePassword(
      userCurrentInputPassword,
    );

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    checkIsPasswordStrong(userNewInputPassword);

    const newPasswordHash = await bcrypt.hash(userNewInputPassword, 10);
    user.password = newPasswordHash;
    await user.save()

    res.send("Password has been updated successfully !")

  } catch (e) {
    res.status(400).send("ERROR: " + e.message);
  }
});

module.exports = profileRouter;
