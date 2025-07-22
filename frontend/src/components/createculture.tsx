import React, { useEffect, useState } from 'react';
import { api , CreateCultureData } from '../services/api';

interface Variety {
  _id: string;
  name: string;
}

const CreateCulture = () => {
  const [formData, setFormData] = useState({
    nom: '',
    variete: '',
    datePlantation: '',
    dateRecolte: '',
    typeIrrigation: '',
  });

  const [varietes, setVarietes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const res = await api.getVarieties();
        setVarietes(res);
      } catch (err) {
        console.error('Erreur lors du chargement des variétés');
      }
    };

    fetchVarieties();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const cultureToSend: CreateCultureData = {
        ...formData,
        datePlantation: new Date(formData.datePlantation),
        dateRecolte: new Date(formData.dateRecolte),
      };

      await api.createCulture(cultureToSend);
      setSuccess('Culture créée avec succès !');
      setFormData({
        nom: '',
        variete: '',
        datePlantation: '',
        dateRecolte: '',
        typeIrrigation: '',
      });
    } catch (err) {
      setError('Erreur lors de la création de la culture.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white via-green-50 to-green-100 p-10 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Créer une Culture</h2>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-700 mb-4 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {[ 
          { label: 'Nom', name: 'nom', type: 'text', placeholder: 'Nom de la culture' },
          { label: 'Date de plantation', name: 'datePlantation', type: 'date' },
          { label: 'Date de récolte', name: 'dateRecolte', type: 'date' },
          { label: "Type d'irrigation", name: 'typeIrrigation', type: 'text', placeholder: 'ex: Goutte à goutte' },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label className="block mb-1 font-semibold">{label}</label>
            <input
              type={type}
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              required
              placeholder={placeholder}
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-semibold">Variété</label>
          <select
            name="variete"
            value={formData.variete}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Sélectionner une variété --</option>
            {varietes.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Création en cours...' : 'Créer la culture'}
        </button>
      </form>
    </div>
  );
};

export default CreateCulture;
