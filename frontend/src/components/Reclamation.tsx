import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ChatBott from './ChatBott';

const ReclamationForm: React.FC = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const role = "consommateur";

  const handleReclamation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createReclamation({
        description,
        date: new Date(),
      });
      setSuccessMessage('📩 Réclamation envoyée avec succès');
      setDescription('');
    } catch (error) {
      setSuccessMessage('❌ Erreur lors de la soumission de la réclamation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
   
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* ✅ Notification en bas à droite */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-100 border border-red-400 text-red-800 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-red-700 font-bold hover:text-black transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* Image bannière */}
      <header className="w-full h-40 overflow-hidden">
        <img
          src="/raclamm.png"
          alt="Navbar background"
          className="w-full h-full object-cover"
        />
      </header>

      {/* Message défilant */}
      <div className="w-full bg-white py-4 mt-14">
        <p className="text-red-700 font-semibold text-center text-lg animate-pulse">
          Vos réclamations sont notre priorité
        </p>
      </div>

      {/* Formulaire */}
      <main className="flex flex-grow items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-red-700 mb-6 text-center">
            N’hésitez surtout pas à les faire ❗
          </h2>
          <form onSubmit={handleReclamation}>
            <textarea
              className="w-full border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-700"
              rows={6}
              placeholder="Décrivez votre problème..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-md transition disabled:opacity-50 w-full text-lg font-medium shadow-md"
            >
              {loading ? 'Envoi...' : 'Soumettre'}
            </button>
          </form>
        </div>
      </main>
        <div className="fixed bottom-6 right-6 z-50">
  <ChatBott role={role} conversationId={null} />
</div>
    </div>
   
  );
};

export default ReclamationForm;
