// ✅ ChatSidebar.tsx (corrigé)
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Conversation {
  _id: string;
  firstMessage: string;
  createdAt: string;
}

interface Props {
  userId: string;
  onSelect: (conversationId: string) => void;
  activeConversationId: string;
}

const ChatSidebar: React.FC<Props> = ({ userId, onSelect, activeConversationId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    axios
      .get(`https://agritrace.azizarfaoui.ip-ddns.com/api/chat/conversations/${userId}`)
      .then((res) => setConversations(res.data))
      .catch((err) => console.error("Erreur chargement conversations", err));
  }, [userId]);

  return (
    <div className="w-64 bg-white shadow-md border-r h-screen overflow-y-auto p-4 space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">🕑 Historique</h2>
      </div>

      {conversations.map((conv) => (
        <div
          key={conv._id}
          onClick={() => onSelect(conv._id)}
          className={`cursor-pointer p-2 rounded-md transition ${
            activeConversationId === conv._id
              ? "bg-blue-100 text-blue-800 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          <div className="text-sm line-clamp-1">{conv.firstMessage}</div>
          <div className="text-xs text-gray-500">
            {new Date(conv.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
