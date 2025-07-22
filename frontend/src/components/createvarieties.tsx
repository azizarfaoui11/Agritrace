import { useState } from 'react';
import { FaSeedling, FaShieldAlt, FaImage } from 'react-icons/fa';
import { api } from '../services/api';

interface Variety {
  name: string;
  diseaseResistance: string;
}

const FaSeedlingIcon = FaSeedling as React.FC<React.SVGProps<SVGSVGElement>>;
const FaShieldAltIcon = FaShieldAlt as React.FC<React.SVGProps<SVGSVGElement>>;
const FaImageIcon = FaImage as React.FC<React.SVGProps<SVGSVGElement>>;

const CreateVarietyPage = () => {
  const [formData, setFormData] = useState<Variety>({
    name: '',
    diseaseResistance: '',
  });

  //const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('diseaseResistance', formData.diseaseResistance);
     

      await api.createVariety(form);

      setSuccess('Variété créée avec succès !');
      setFormData({ name: '', diseaseResistance: '' });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de la variété.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white via-green-50 to-green-100 p-10 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Créer une nouvelle variété</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Nom de la variété */}
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">
            Nom de la variété
          </label>
          <div className="relative">
            <FaSeedlingIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Orange Valencia"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Résistance aux maladies */}
        <div>
          <label htmlFor="diseaseResistance" className="block mb-1 font-semibold">
            Résistance aux maladies
          </label>
          <div className="relative">
            <FaShieldAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="diseaseResistance"
              name="diseaseResistance"
              type="text"
              value={formData.diseaseResistance}
              onChange={handleChange}
              placeholder="Ex: Haute"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>


        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer la variété'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVarietyPage;
