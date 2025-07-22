import express from "express";
  
import { chatWithGemini } from "../controllers/chatController";
import { auth } from "../middleware/auth"; // si tu veux protéger les routes
import {  getConversations, getMessages, saveMessage } from "../controllers/messageController";



const router = express.Router();

router.post("/", chatWithGemini);
router.get("/messages/:conversationId", auth, getMessages);


router.post("/messages", auth, saveMessage);


router.get("/conversations/:userId",auth, getConversations);



export default router;
