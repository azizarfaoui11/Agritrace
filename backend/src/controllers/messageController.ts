import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import Message from "../models/Message";
import { Response } from "express";


export const saveMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { role, content,conversationId } = req.body;
     const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }
    const message = await Message.create({ userId, role, content,conversationId });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement du message." });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const conversations = await Message.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$conversationId",
          firstMessage: { $first: "$content" },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des conversations." });
  }
};


export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      res.status(400).json({ error: "conversationId manquant." });
      return;
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Erreur lors de la récupération des messages:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des messages." });
  }
};

  


