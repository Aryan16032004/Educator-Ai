
import { Router } from "express";
import { createQuestion, createSubject, getSubject, logOutUser,loginUser,querySeparator,registerUser, verifyToken } from "../Controller/user.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";



const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)


//secured Routes
router.route("/logout").post(verifyJWT ,logOutUser)

router.route("/createSubject").post(verifyJWT ,createSubject)

router.route("/getSubs").get(verifyJWT ,getSubject)

router.route("/question").post(verifyJWT ,createQuestion)

router.route("/separator").post(verifyJWT ,querySeparator)

router.route("/verify-token").get(verifyToken)

export default router