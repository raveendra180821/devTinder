const User = require("../models/user");
const userSchemaObject = require("../models/userSchemaObject");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      res.status(400).send("Error: Token Not Found !");
    } else {
      const decodedToken = jwt.verify(token, "Ravi@G12%");
      const {id} = decodedToken

      const user = await User.findOne({_id: id}).select("-createdAt -updatedAt -__v")
      if (user === null){
        res.status(400).send("Error: User Not Found !!!")
      }
      req.user = user
      next();
    }
  } catch (err) {
    res.send(err.message)
  }
};

module.exports = {userAuth};
