const router = require("express").Router();

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User.model");

const isAuthenticated = require("../middleware/isAuthenticated")

// POST "/api/auth/signup" to register (create) a new user
router.post("/signup", async (req, res, next) => {

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ errorMessage: "Provide all fields" })
    return;
  }

  // BE Validations

  try {

    const foundUser = await UserModel.findOne( { email } )
    if (foundUser) {
      res.status(400).json( {errorMessage: "email already registered"});
      return 
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
      name, 
      email, 
      password: hashPassword
    })

    res.status(201).json()

  } catch(err) {
    next(err)
  }
})

// POST "/api/auth/login" to validate credentials of a user and send auth token
router.post("/login", async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password ) {
    res.status(400).json({ errorMessage: "Provide all fields" })
    return;
  }

// BE Validations

  try {

    const foundUser = await UserModel.findOne( { email } )

    if (!foundUser) {
      res.status(400).json( {errorMessage: "User not found"});
      return 
    }

    const passwordCorrect = await bcrypt.compare(password, foundUser.password);

    if (!passwordCorrect) {
      res.status(400).json( {errorMessage: "Invalid Password"});
      return
    }

    const payload = { 
      _id: foundUser._id, 
      email: foundUser.email, 
      name: foundUser.name
    } 


    const authToken = jwt.sign( 
      payload, 
      process.env.TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: "6h" }
    );
  
    res.status(200).json({ authToken: authToken });

  } catch(err) {
    next(err)
  }
})

// GET "/api/auth/verify" to verify token (used for auth FE routes)
router.get('/verify', isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
