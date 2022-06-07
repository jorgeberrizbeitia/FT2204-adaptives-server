const router = require("express").Router();

const uploader = require("../middleware/cloudinary")

// esta ruta solo va a enviar una imagen a cloudiry y recibe el URL
router.post("/", uploader.single("image"), (req, res, next) => {

    console.log(req.file.path) // la imagen de coudinary

    res.json(req.file.path)

})

module.exports = router;