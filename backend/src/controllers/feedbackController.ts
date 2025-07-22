// controllers/FeedbackController.ts
import Feedback from "../models/Feedback";
import { Request, Response } from "express";

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getAllFeedbacks = async (_: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().populate("produit");
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate("utilisateur produit");
    if (!feedback) 
         res.status(404).json({ message: "Feedback not found" });
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const updated = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
