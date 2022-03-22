const router = require("express").Router();

const UserModel = require("../models/User.model");

const isAuthenticated = require("../middleware/isAuthenticated")

// POST "/api/profile" to get logged user profile
router.get("/", isAuthenticated, async (req, res, next) => {

  const { _id } = req.payload
  console.log(_id)
  try {
    const response = await UserModel.findById(_id)
    console.log(response)
    res.json(response)
  } catch(err) {
    next(err)
  }

})

module.exports = router;
