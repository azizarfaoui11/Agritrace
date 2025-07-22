import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { MessageSquare, Trash2, Star } from "lucide-react";

interface Feedback {
  _id: string;
  commentaire: string;
  date: string;
  note: number;
  produit: {
    _id: string;
    libelle: string;
  };
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchData = async () => {
    try {
      const data = await api.getAllFeedback();
      setFeedbacks(data);
    } catch (err) {
      setError("Erreur lors du chargement des feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
      if (window.confirm("Confirmer la suppression ?")) {
        await api.deleteFeedback(id);
        fetchData();
      }
    };

  const renderStars = (note: number) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      

      {loading && <p className="text-gray-500 animate-pulse">Chargement des commentaires...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && feedbacks.length === 0 && (
        <p className="text-gray-500 italic">Aucun commentaire pour le moment.</p>
      )}

      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            className="flex justify-between gap-4 bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition duration-300"
          >
            <div className="flex gap-4 w-full">
              <div className="text-blue-500">
                <MessageSquare className="w-6 h-6 mt-1" />
              </div>
              <div className="flex-1">
                      <div className="flex justify-between items-center">
  <span className="text-xs text-gray-400">
    {new Date(fb.date).toLocaleDateString()}
  </span>
</div>
                <p className="text-gray-700 mt-2">{fb.commentaire}</p>
         
              </div>
        

<div className="mt-1">
  {renderStars(fb.note)}
  <p className="text-sm text-gray-500 italic mt-1">
    {fb.produit?.libelle || "Produit inconnu"}
  </p>
</div>

            </div>

            <button
              onClick={() => handleDelete(fb._id)}
              className="text-red-500 hover:text-red-700 transition mt-1"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      
    </div>
    
  );
};

export default FeedbackList;
