import React, { useEffect, useState } from 'react';
import { FaBoxOpen, FaHashtag, FaImage } from 'react-icons/fa';
import { api } from '../services/api';

interface CreateProduitData {
  libelle: string;
  quantite: number;
  parcel: string;
  etat:string;
}

interface Parcel {
  _id: string;
  nom: string;
}

const FaLibelleIcon = FaBoxOpen as React.FC<React.SVGProps<SVGSVGElement>>;
const FaQuantiteIcon = FaHashtag as React.FC<React.SVGProps<SVGSVGElement>>;
const FaImageIcon = FaImage as React.FC<React.SVGProps<SVGSVGElement>>;

const CreateProduit = () => {
  const [formData, setFormData] = useState<CreateProduitData>({
    libelle: '',
    quantite: 0,
    parcel: '',
    etat: 'disponible'
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const [p] = await Promise.all([api.getParcels()]);
        setParcels(p.map((item: any) => ({ _id: item._id, nom: item.nom })));
      } catch (err) {
        setError("Erreur lors du chargement des parcelles.");
      }
    };
    fetchParcels();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantite' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!formData.parcel) {
      setError('Veuillez sélectionner une parcelle.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('libelle', formData.libelle);
      data.append('quantite', formData.quantite.toString());
      data.append('parcel', formData.parcel);
      data.append('etat',formData.etat );
      if (image) data.append('image', image);

      await api.createProduit(data);

      setSuccess('Produit créé avec succès !');
      setFormData({ libelle: '', quantite:0, parcel: '', etat:'' });
      setImage(null);
    } catch (err) {
      setError('Erreur lors de la création du produit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white via-green-50 to-green-100 p-10 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
        Créer un produit
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Libellé */}
        <div>
          <label htmlFor="libelle" className="block mb-1 text-sm font-medium text-gray-700">Libellé</label>
          <div className="relative">
            <FaLibelleIcon className="absolute left-3 top-3 text-gray-400" />
            <input
              id="libelle"
              name="libelle"
              type="text"
              value={formData.libelle}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Nom du produit"
            />
          </div>
        </div>

        {/* Quantité */}
        <div>
          <label htmlFor="quantite" className="block mb-1 text-sm font-medium text-gray-700">Quantité</label>
          <div className="relative">
            <FaQuantiteIcon className="absolute left-3 top-3 text-gray-400" />
            <input
              id="quantite"
              name="quantite"
              type="number"
              value={formData.quantite}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Quantité"
            />
          </div>
        </div>

        {/* Parcelle */}
        <div>
          <label htmlFor="parcel" className="block mb-1 text-sm font-medium text-gray-700">Parcelle</label>
          <select
            id="parcel"
            name="parcel"
            value={formData.parcel}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">-- Sélectionner une parcelle --</option>
            {parcels.map((parcel) => (
              <option key={parcel._id} value={parcel._id}>
                {parcel.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700">Image</label>
          <div className="relative">
            <FaImageIcon className="absolute left-3 top-3 text-gray-400" />
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          {image && (
            <p className="text-sm text-gray-500 mt-2 pl-2">
              Image sélectionnée : {image.name}
            </p>
          )}
        </div>

        {/* Bouton */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer le produit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduit;
