const router = require("express").Router();

const UserModel = require("../models/User.model");

const isAuthenticated = require("../middleware/isAuthenticated")

// POST "/api/profile" to get logged user profile
router.get("/", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload
  try {
    const response = await UserModel.findById(_id)
    res.json(response)
  } catch(err) {
    next(err)
  }
})

// PATCH "/api/profile" to get logged user profile
router.patch("/", isAuthenticated, async (req, res, next) => {

  const { _id } = req.payload
  const { name, email, image } = req.body

  try {
    await UserModel.findByIdAndUpdate(_id, {
      name, 
      email,
      profilePic: image
    })
    res.json("user updated")
  } catch(err) {
    next(err)
  }

})

module.exports = router;
