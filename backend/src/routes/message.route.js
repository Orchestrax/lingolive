import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", isLoggedIn, upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }, { name: "audio", maxCount: 1 }, { name: "file", maxCount: 1 }]), sendMessage);
router.get("/:userId", isLoggedIn, getMessages);

export default router;
