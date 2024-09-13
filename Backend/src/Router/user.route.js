import { Router } from "express";
import { logOutUser,loginUser,registerUser } from "../Controller/user.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)

    // router.route('/your-endpoint').post(endpoint)

router.route("/login").post(loginUser)


//secured Routes
router.route("/logout").post(verifyJWT ,logOutUser)


export default router