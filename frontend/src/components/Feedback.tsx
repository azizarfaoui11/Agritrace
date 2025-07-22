import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import ChatBott from './ChatBott';

const FeedbackForm: React.FC = () => {
  const [commentaire, setCommentaire] = useState('');
  const [note, setNote] = useState(0);
  const [produit, setProduit] = useState('');
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const role="consommateur";

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const data = await api.getproduits();
        setProduits(data);
      } catch (err) {
        toast.error("Erreur lors du chargement des produits");
      }
    };
    fetchProduits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note || !produit) {
      toast.warning("Veuillez noter le produit et en sélectionner un.");
      return;
    }

    setLoading(true);
    try {
      await api.createFeedback({
        commentaire,
        date: new Date(),
        note,
        produit,
      });

      setCommentaire('');
      setNote(0);
      setProduit('');
      setSuccessMessage("Feedback envoyé avec succès 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi du feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-no-repeat bg-left bg-contain pointer-events-none"
        style={{
          backgroundImage: "url('/feedback.jpg')",
          backgroundPosition: 'left center',
        }}
      />

      <div className="relative z-10 w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl ml-40">
        {/* Notification succès */}
        {successMessage && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-green-100 border border-green-400 text-green-800 px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-fade-in">
            ✅ {successMessage}
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-4 text-green-700 font-bold hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Donner un avis 💬</h2>
        <form onSubmit={handleSubmit}>
          {/* Sélection produit */}
          <label className="block mb-2 text-gray-700 font-medium">Produit concerné :</label>
          <select
            className="w-full mb-4 border rounded-md p-2"
            value={produit}
            onChange={(e) => setProduit(e.target.value)}
            required
          >
            <option value="">-- Choisir un produit --</option>
            {produits.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.libelle}
              </option>
            ))}
          </select>

          {/* Note étoiles */}
          <label className="block mb-2 text-gray-700 font-medium">Note :</label>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-6 h-6 cursor-pointer transition-transform duration-150 ${
                  n <= note ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-300'
                }`}
                onClick={() => setNote(n)}
              />
            ))}
          </div>

          {/* Zone de texte */}
          <textarea
            className="w-full border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-900"
            rows={5}
            placeholder="Écrivez votre commentaire..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            required
          />

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-900 hover:bg-blue-950 text-white px-6 py-3 rounded-md transition duration-300 disabled:opacity-50 w-full shadow-md"
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
        
      </div>
       <div className="fixed bottom-6 right-6 z-50">
  <ChatBott role={role} conversationId={null} />
</div>
    </div>
  );
};

export default FeedbackForm;
