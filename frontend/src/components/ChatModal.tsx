// src/components/ChatModal.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type Props = {
  conversationId: string;
  onClose: () => void;
};

const ChatModal: React.FC<Props> = ({ conversationId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResumed, setIsResumed] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const API_URL = "http://localhost:5000/api";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "user";

  useEffect(() => {
    axios
      .get(`${API_URL}/chat/messages/${conversationId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Erreur récupération messages :", err));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // 1. Sauvegarder le message utilisateur
      await axios.post(`${API_URL}/chat/messages`, {
        userId: user._id,
        role: "user",
        content: newMessage,
        conversationId,
      });

      // 2. Appel à Gemini
      const res = await axios.post(`${API_URL}/chat`, {
        message: newMessage,
        role,
      });

      const assistantReply = res.data.reply;

      // 3. Sauvegarder la réponse assistant
      await axios.post(`${API_URL}/chat/messages`, {
        userId: user._id,
        role: "assistant",
        content: assistantReply,
        conversationId,
      });

      // 4. Mise à jour locale
      setMessages((prev) => [
        ...prev,
        { role: "user", content: newMessage, createdAt: new Date().toISOString() },
        { role: "assistant", content: assistantReply, createdAt: new Date().toISOString() },
      ]);

      setNewMessage("");
    } catch (error) {
      console.error("Erreur d’envoi dans ChatModal :", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">💬 Discussion</h2>
          <button onClick={onClose} className="text-red-600 hover:text-red-800 text-xl">✖</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-md max-w-[85%] shadow-sm ${
                msg.role === "user" ? "bg-blue-100 text-right ml-auto" : "bg-gray-100 text-left mr-auto"
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {msg.role === "user" ? "👤 you" : "🤖 Assistant"}
              </div>
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {!isResumed ? (
          <div className="text-center mt-4">
            <button
              onClick={() => setIsResumed(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              ▶️ Reprendre la conversation
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Écrire un message..."
              className="flex-1 px-3 py-2 border rounded focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Envoyer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
