import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  CubeIcon,
  MapIcon,
  BeakerIcon,
  SunIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const [produits, setProduits] = useState<any[]>([]);
  const [parcels, setParcels] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [cultures, setCultures] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proRes, parcelsRes, cultureRes, varietiesRes] = await Promise.all([
          api.getproduits(),
          api.getParcels(),
          api.getCultures(),
          api.getVarieties(),
        ]);

        setProduits(proRes);
        setParcels(parcelsRes);
        setVarieties(varietiesRes);
        setCultures(cultureRes);
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

   return (
    <div className="max-w-7xl mx-auto p-6">
     

      {isLoading ? (
        <div className="text-center text-blue-600 font-medium animate-pulse">
          Chargement des données...
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md shadow mb-6 text-center">
          {error}
        </div>
      ) : (
        <div className="space-y-14">

          {/* PRODUITS */}
          <section>
            <div className="flex items-center mb-4">
              <CubeIcon className="h-7 w-7 text-blue-600 mr-3" />
              <h3 className="text-3xl font-semibold text-gray-800">Produits</h3>
            </div>
            {produits.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Libellé</th>
                    <th className="px-4 py-3 text-left">Quantité</th>
                    <th className="px-4 py-3 text-left">Parcelle</th>
                    <th className="px-4 py-3 text-left">État</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map((produit) => (
                    <tr key={produit.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{produit.libelle}</td>
                      <td className="px-4 py-3">{produit.quantite}</td>
                      <td className="px-4 py-3">{produit.parcel?.nom ?? 'N/A'}</td>
                      <td className="px-4 py-3">{produit.etat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">Aucun produit disponible.</p>
            )}
          </section>

          {/* PARCELLES */}
          <section>
            <div className="flex items-center mb-4">
              <MapIcon className="h-7 w-7 text-green-600 mr-3" />
              <h3 className="text-3xl font-semibold text-gray-800">Parcelles</h3>
            </div>
            {parcels.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nom</th>
                    <th className="px-4 py-3 text-left">Localisation</th>
                    <th className="px-4 py-3 text-left">Surface (ha)</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((parcel) => (
                    <tr key={parcel._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{parcel.nom}</td>
                      <td className="px-4 py-3">{parcel.parcelLocation ?? 'Non défini'}</td>
                      <td className="px-4 py-3">{parcel.area ?? 'Non défini'} ha</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">Aucune parcelle trouvée.</p>
            )}
          </section>

          {/* CULTURES */}
          <section>
            <div className="flex items-center mb-4">
              <GlobeAltIcon className="h-7 w-7 text-indigo-600 mr-3" />
              <h3 className="text-3xl font-semibold text-gray-800">Cultures</h3>
            </div>
            {cultures.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nom</th>
                    <th className="px-4 py-3 text-left">Date plantation</th>
                    <th className="px-4 py-3 text-left">Date récolte</th>
                    <th className="px-4 py-3 text-left">Irrigation</th>
                    <th className="px-4 py-3 text-left">Variété</th>
                  </tr>
                </thead>
               <tbody>
  {cultures.map((culture) => (
    <tr key={culture._id} className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">{culture.nom}</td>
      <td className="px-4 py-3">
        {new Date(culture.datePlantation).toLocaleDateString('fr-FR')}
      </td>
      <td className="px-4 py-3">
        {new Date(culture.dateRecolte).toLocaleDateString('fr-FR')}
      </td>
      <td className="px-4 py-3">{culture.typeIrrigation}</td>
      <td className="px-4 py-3">{culture.variete?.name}</td>
    </tr>
  ))}
</tbody>

              </table>
            ) : (
              <p className="text-gray-600">Aucune culture disponible.</p>
            )}
          </section>
           <section>
            <div className="flex items-center mb-4">
              <BeakerIcon className="h-7 w-7 text-emerald-600 mr-3" />
              <h3 className="text-3xl font-semibold text-gray-800">Variétés</h3>
            </div>
            {varieties.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-emerald-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nom de la variété</th>
                    <th className="px-4 py-3 text-left">Resistance</th>

                  </tr>
                </thead>
                <tbody>
                  {varieties.map((variety) => (
                    <tr key={variety._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{variety.name}</td>
                      <td className="px-4 py-3">{variety.diseaseResistance}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">Aucune variété disponible.</p>
            )}
          </section>

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;