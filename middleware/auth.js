const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  const decoded = jwt.verify(token, config.TOKEN);
  console.log("decoded:",decoded)
  if(decoded){
    req.user = decoded;
    return next();
  }
  else{
    return res.status(403).send("You need to login!");
  }
};

module.exports = verifyToken;