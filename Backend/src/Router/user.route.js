<<<<<<< HEAD
import { Router } from "express";
import { createQuestion, createSubject, getSubject, logOutUser,loginUser,querySeparator,registerUser } from "../Controller/user.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

=======
import  { Router } from "express";
import express from "express"
import { logOutUser,loginUser,registerUser } from "../Controller/user.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const app = express();


>>>>>>> 93b0111130dbb5b26a9781c6ed6846c602ee1cdb

const router = Router()

router.route("/register").post(registerUser)

    // router.route('/your-endpoint').post(endpoint)

router.route("/login").post(loginUser)


//secured Routes
router.route("/logout").post(verifyJWT ,logOutUser)

router.route("/createSubject").post(verifyJWT ,createSubject)

router.route("/question").post(verifyJWT ,createQuestion)

router.route("/separator").post(verifyJWT ,querySeparator)

router.route("/getSubs").get(verifyJWT ,getSubject)


export default router