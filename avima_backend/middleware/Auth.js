const jwt = require("jsonwebtoken");
require("dotenv").config()
const auth = (req, res, next) => {
  try {

    // console.log(req.headers.authorization);

    const token =
      req.headers.authorization.split(" ")[1];

    // console.log(token);

    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(verifyToken);

    req.user = verifyToken;

    next();

  } catch (err) {

    console.log("JWT ERROR:", err.message);

    return res.status(403).json({
      msg: "Invalid token"
    });

  }
};

module.exports = auth;