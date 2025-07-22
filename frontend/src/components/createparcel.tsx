import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaRulerCombined, FaSeedling } from 'react-icons/fa';
import { api } from '../services/api';





const FaMapMarkerAltIcon = FaMapMarkerAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaRulerCombinedIcon = FaRulerCombined as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaSeedlingIcon = FaSeedling as unknown as React.FC<React.SVGProps<SVGSVGElement>>;



interface CreateParcelData {
  nom: string;
  parcelLocation: string;
  area: number;
  culture: string;
  traitement: string;
}

interface Culture {
  _id: string;
  nom: string;
}

interface Traitement {
  _id: string;
  nomPesticide: string;
}



interface InputFieldProps {
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = 'text',
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  value,
  onChange,
  options,
}) => (
  <div>
    <label className="block mb-1 font-semibold text-green-800">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">-- Sélectionner --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const CreateParcelPage = () => {
  const [formData, setFormData] = useState<CreateParcelData>({
    nom: '',
    parcelLocation: '',
    area: 0,
    culture: '',
    traitement: '',
  });

  const [cultures, setCultures] = useState<Culture[]>([]);
  const [traitements, setTraitements] = useState<Traitement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, t, p] = await Promise.all([
          api.getCultures(),
          api.gettraitements(),
          api.getproduits(),
        ]);
        
          setCultures(c.map((item: any) => ({ _id: item._id, nom: item.nom })));
           setTraitements(t.map((item: any) => ({ _id: item._id, nomPesticide: item.nomPesticide }))); 

      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des données.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'area' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      await api.createParcel(formData);
      setSuccess('Parcelle créée avec succès');
      setFormData({
        nom: '',
        parcelLocation: '',
        area: 0,
        culture: '',
        traitement: '',
      });
    } catch (err) {
      console.error(err);
      setError("Échec de la création de la parcelle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white via-green-50 to-green-100 p-10 rounded-2xl shadow-2xl">
      <h2 className="text-4xl font-extrabold text-center text-green-800 mb-8">
        Créer une nouvelle parcelle
      </h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {success && <p className="text-green-700 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={<FaSeedlingIcon />}
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom de la parcelle"
        />

        <InputField
          icon={<FaMapMarkerAltIcon />}
          name="parcelLocation"
          value={formData.parcelLocation}
          onChange={handleChange}
          placeholder="Localisation de la parcelle"
        />

        <InputField
          icon={<FaRulerCombinedIcon />}
          name="area"
          type="number"
          value={formData.area}
          onChange={handleChange}
          placeholder="Superficie en m²"
        />

        <SelectField
          label="Culture"
          name="culture"
          value={formData.culture}
          onChange={handleChange}
          options={cultures.map(c => ({ value: c._id, label: c.nom }))}
        />

        <SelectField
          label="Traitement"
          name="traitement"
          value={formData.traitement}
          onChange={handleChange}
          options={traitements.map(t => ({ value: t._id, label: t.nomPesticide }))}
        />

      

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-md transition duration-200"
          >
            {loading ? 'Création en cours...' : 'Créer la parcelle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateParcelPage;
