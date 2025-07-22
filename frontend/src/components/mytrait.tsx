import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FaShieldAlt, FaTint, FaFlask } from 'react-icons/fa';
import { MdWaterDrop } from 'react-icons/md';

interface Traitement {
  _id: string;
  nomPesticide: string;
  quantitePesticide: string;
  waterUsage: string;
}
const FaFlaskIcon = FaFlask as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const MdWaterDropIcon = MdWaterDrop as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaTintIcon = FaTint as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaShieldAltIcon = FaShieldAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;




const MyTraitements: React.FC = () => {
  const [traitements, setTraitements] = useState<Traitement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .fetchMyTraitements(token)
      .then(setTraitements)
      .catch((err) => console.error('Erreur:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
  <FaShieldAltIcon className="text-green-600 text-3xl" />
  Mes Traitements
</h2>


      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : traitements.length === 0 ? (
        <p className="text-gray-500 text-center">Aucun traitement trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {traitements.map((traitement) => (
            <div
              key={traitement._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-green-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                  <FaFlaskIcon className="text-green-500" />
                  {traitement.nomPesticide}
                </h3>
              </div>
              <div className="mb-2 text-gray-700 flex items-center gap-2">
                <FaTintIcon className="text-blue-400" />
                <span>Quantité : </span>
                <strong>{traitement.quantitePesticide}</strong>
              </div>
              <div className="text-gray-700 flex items-center gap-2">
                <MdWaterDropIcon className="text-sky-400" />
                <span>Utilisation d'eau : </span>
                <strong>{traitement.waterUsage}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTraitements;
