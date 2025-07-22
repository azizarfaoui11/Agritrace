import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface StockFormModalProps {
  onClose: () => void;
  onStockAdded: () => void;
}

const StockFormModal: React.FC<StockFormModalProps> = ({ onClose, onStockAdded }) => {
  const [zones, setZones] = useState<any[]>([]);
  const [produits, setProduits] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nom: "",
    zone: "zone A",
    dateEntree: new Date().toISOString().split("T")[0],
    dateSortie: "",
    temperature: "",
    produit: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [zonesData, produitsData] = await Promise.all([
        api.getAllZones(),
        api.getProducts(),
      ]);
      setZones(zonesData);
      setProduits(produitsData);
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      temperature: parseFloat(formData.temperature),
      dateEntree: new Date(formData.dateEntree),
      dateSortie: formData.dateSortie ? new Date(formData.dateSortie) : null,
    };
    await api.createStock(payload);
    onStockAdded();
    onClose(); // ferme la modale après ajout
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
 <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du stock</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
            <select
              name="produit"
              value={formData.produit}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choisir un produit --</option>
              {produits.map((produit) => (
                <option key={produit._id} value={produit._id}>
                  {produit.libelle}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d’entrée</label>
              <input
                type="date"
                name="dateEntree"
                value={formData.dateEntree}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de sortie</label>
              <input
                type="date"
                name="dateSortie"
                value={formData.dateSortie}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Température (°C)</label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockFormModal;
