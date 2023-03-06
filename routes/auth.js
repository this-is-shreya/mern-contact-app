const { login, signUp, verifyOtp,logout } = require("../controllers/auth");
const { checkAuth } = require("../middleware/auth");

const router = require("express").Router();

router.post("/login", login);
router.post("/signup", signUp);
router.post("/logout",checkAuth,logout)


module.exports = router
