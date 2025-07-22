import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FaShieldAlt } from 'react-icons/fa';

interface Variety {
  _id: string;
  name: string;
  diseaseResistance: string;
}

const FaShieldAltIcon = FaShieldAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const MyVarieties: React.FC = () => {
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .fetchMyVarietys(token)
      .then(setVarieties)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🌾 Mes Variétés
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : varieties.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune variété trouvée.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {varieties.map((variety) => (
            <div
              key={variety._id}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {variety.name}
              </h3>
              <p className="text-sm text-gray-700">
                <FaShieldAltIcon className="inline mr-2 text-green-600" />
                Résistance : <strong>{variety.diseaseResistance}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVarieties;
