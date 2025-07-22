import React, { useState } from 'react';
import { FaFlask, FaBalanceScale, FaTint } from 'react-icons/fa';
import { api, CreateTraitementData } from '../services/api';

const FaFlaskIcon = FaFlask as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaBalanceScaleIcon = FaBalanceScale as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaTintIcon = FaTint as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const CreateTraitement = () => {
  const [formData, setFormData] = useState<CreateTraitementData>({
    nomPesticide: '',
    quantitePesticide: 0,
    waterUsage: 0,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantitePesticide' || name === 'waterUsage' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.createTraitement(formData);
      setSuccess('Traitement créé avec succès !');
      setFormData({ nomPesticide: '', quantitePesticide: 0, waterUsage: 0 });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du traitement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white via-green-50 to-green-100 p-10 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Créer un Traitement</h2>

      {error && <p className="text-red-600 mb-5 text-center">{error}</p>}
      {success && <p className="text-green-600 mb-5 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom du pesticide */}
        <div className="relative">
          <FaFlaskIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="nomPesticide"
            value={formData.nomPesticide}
            onChange={handleChange}
            placeholder="Nom du pesticide"
            required
            className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Quantité */}
        <div className="relative">
          <FaBalanceScaleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            name="quantitePesticide"
            value={formData.quantitePesticide}
            onChange={handleChange}
            min={0}
            step="any"
            placeholder="Quantité (litres ou grammes)"
            required
            className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Eau */}
        <div className="relative">
          <FaTintIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            name="waterUsage"
            value={formData.waterUsage}
            onChange={handleChange}
            min={0}
            step="any"
            placeholder="Utilisation d'eau (en litres)"
            required
            className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer le traitement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTraitement;
