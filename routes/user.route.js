import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const router = express.Router();

// Example user route
router.get("/", (req, res) => {
    res.send("User route is working!");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;