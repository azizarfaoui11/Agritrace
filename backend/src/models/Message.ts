import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  userId: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  conversationId?: string; // 🆕 conversationId en option
}

const MessageSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  conversationId: { type: String }, // 🆕 conversationId simple string
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
