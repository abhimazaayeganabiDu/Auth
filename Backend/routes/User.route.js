import express from "express";
import { changePassword, login, registerUser, resetPassword, verifyToken } from "../controllers/User.controller.js";


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", login);
router.get("/verify/:token", verifyToken)
router.post("/changePassword/:token", changePassword)
router.post("/resetPassword", resetPassword)


export default router;