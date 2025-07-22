import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FaSeedling, FaCalendarAlt, FaTint, FaLeaf } from 'react-icons/fa';

interface Culture {
  _id: string;
  nom: string;
  variete: {
    _id: string;
    name: string;
  };
  datePlantation: string;
  dateRecolte: string;
  typeIrrigation: string;
}

const FaSeedlingIcon = FaSeedling as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaCalendarAltIcon = FaCalendarAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaTintIcon = FaTint as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaLeafIcon = FaLeaf as unknown as React.FC<React.SVGProps<SVGSVGElement>>;



// Fonction utilitaire pour formater les dates en français
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const MyCultures: React.FC = () => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .fetchMyCultures(token)
      .then((data) => setCultures(data))
      .catch((err) => console.error('Erreur:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
        <FaSeedlingIcon className="text-green-600 text-3xl" />
  Mes Cultures
</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : cultures.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune culture trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultures.map((culture) => (
            <div
              key={culture._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-green-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-green-700 flex items-center gap-2 mb-4">
                <FaSeedlingIcon className="text-green-500" />
                {culture.nom}
              </h3>

              <div className="text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAltIcon className="text-blue-500" />
                <span>Plantation :</span>
                <strong>{formatDate(culture.datePlantation)}</strong>
              </div>

              <div className="text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAltIcon className="text-orange-500" />
                <span>Récolte :</span>
                <strong>{formatDate(culture.dateRecolte)}</strong>
              </div>

              <div className="text-gray-700 mb-2 flex items-center gap-2">
                <FaTintIcon className="text-sky-500" />
                <span>Irrigation :</span>
                <strong>{culture.typeIrrigation}</strong>
              </div>

              <div className="text-gray-700 flex items-center gap-2">
                <FaLeafIcon className="text-lime-600" />
                <span>Variété :</span>
                <strong>{culture.variete?.name}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCultures;
