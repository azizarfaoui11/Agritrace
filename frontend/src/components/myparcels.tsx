import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FaMapMarkerAlt, FaRulerCombined } from 'react-icons/fa';

const FaMapMarkerAltIcon = FaMapMarkerAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaRulerCombinedIcon = FaRulerCombined as unknown as React.FC<React.SVGProps<SVGSVGElement>>;



interface Parcel {
  _id: string;
  nom: string;
  parcelLocation: string;
  area: number;
}

const MyParcels: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .fetchMyParcels(token)
      .then((data) => setParcels(data))
      .catch((err) => console.error('Erreur:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🌱 Mes Parcelles
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : parcels.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune parcelle trouvée.</p>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel) => (
            <div
              key={parcel._id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {parcel.nom}
              </h3>
              <p className="text-sm text-gray-700">
                <FaMapMarkerAltIcon className="inline mr-2 text-red-500" />
                <span>Localisation : </span> 
                <strong>{parcel.parcelLocation}</strong> 
              </p>
              <p className="text-sm text-gray-700">
                <FaRulerCombinedIcon className="inline mr-2 text-green-700" />
               <span>Superficie :</span>
               <strong>{parcel.area} m²</strong>  
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyParcels;
