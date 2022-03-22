const jwt = require("express-jwt"); 

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: 'payload', 
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      const authToken = req.headers.authorization.split(" ")[1];
      console.log("Token Provided!")
      return authToken;
    } else {
      console.log("No token provided")
      return null;
    }
  }
});

module.exports = isAuthenticated