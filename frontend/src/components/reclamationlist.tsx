import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { AlertCircle, Trash2 } from "lucide-react";

interface Reclamation {
  _id: string;
  description: string;
  date: string;
}

const ReclamationList: React.FC = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReclamations = async () => {
    try {
      const data = await api.getAllReclam();
      setReclamations(data);
    } catch (err) {
      setError("Erreur lors du chargement des réclamations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette réclamation ?")) {
      try {
        await api.deleteReclamation(id);
        fetchReclamations();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
<div className="pt-10 pl-10 max-w-6xl mx-auto">

      {loading && <p className="text-gray-500">Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reclamations.map((rec) => (
          <div
            key={rec._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-6 border border-gray-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>

              <button
                onClick={() => handleDelete(rec._id)}
                className="text-gray-400 hover:text-red-600 transition"
                aria-label="Supprimer la réclamation"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Description complète en dessous avec un léger décalage */}
             <h2 className="text-lg font-semibold text-gray-800 truncate">{rec.description}</h2>

            <div className="mt-auto flex justify-end text-sm text-gray-400 italic select-none">
              {new Date(rec.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReclamationList;
