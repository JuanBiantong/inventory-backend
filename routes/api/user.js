const express = require("express");
const router = express.Router();
const { auth } = require("../../midlewares/auth");
const userController = require("../../controllers/userController");
const userValidation = require("../../midlewares/validation/validateUser");

router.post("/signup", userValidation.validateRegister, userController.createUser);
router.post("/login",
    // userValidation.validateLogin,
    userController.login);

module.exports = router;