// src/components/ChatLayout.tsx
import React, { useState } from "react";
import { MenuIcon, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import ChatBot from "./ChatBot";
import ChatModal from "./ChatModal";

type ChatLayoutProps = {
  role: "Farmer" | "consommateur" | "Transformateur" | "Seller";
};

const ChatLayout: React.FC<ChatLayoutProps> = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [modalConvId, setModalConvId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id || "";

  if (!userId) return null;

  return (
    <>
      {!sidebarOpen && (
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-green-600 text-white">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          <ChatSidebar
            userId={userId}
            onSelect={(id) => {
              setModalConvId(id);
              setSidebarOpen(false);
            }}
            activeConversationId={conversationId}
          />
        </div>
      </div>

      {/* Chat principal (optionnel si modal utilisé pour discuter) */}
      <div className="flex-1 flex flex-col ml-0">
        <ChatBot role={role} conversationId={conversationId} />
      </div>

      {/* Modal interactif */}
      {modalConvId && (
        <ChatModal
          conversationId={modalConvId}
          onClose={() => setModalConvId(null)}
        />
      )}
    </>
  );
};

export default ChatLayout;
