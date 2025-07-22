import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import StockFormModal from "./StockFormModal2";

import {
  Pencil,
  Trash2,
  PackageCheck,
  Thermometer,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

// Formatage de date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StockCardList2 = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<any>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    const data = await api.getStockZoneC();
    setStocks(data);
  };

  const handleEditClick = (stock: any) => {
    setEditingStock(stock);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingStock) return;
    await api.updateStock(editingStock._id, editingStock);
    setEditModalOpen(false);
    fetchStocks();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Confirmer la suppression ?")) {
      await api.deleteStock(id);
      fetchStocks();
    }
  };

  const handleAddStock = async () => {
    setAddModalOpen(false);
    await fetchStocks(); // refresh après ajout
  };
const handleValoriser = async (produitId: string) => {
    await api.updateProduitConformite(produitId, "valoriser");
    fetchStocks();
  };
  
  const handleEliminer = async (produitId: string) => {
    await api.updateProduitConformite(produitId, "eliminer");
    fetchStocks();
  };
  const filteredStocks = stocks.filter((stock) =>
    stock.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-8 drop-shadow">
        🌿 Gestion des Stocks 
      </h1>
      

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="🔍 Rechercher un stock..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 lg:w-1/2 px-4 py-2 rounded-full border border-green-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setAddModalOpen(true)}
  className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-xl hover:bg-green-200 transition"
        >
          ➕ Ajouter un stock
        </button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStocks.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">Aucun stock trouvé.</p>
        ) : (
          filteredStocks.map((stock) => (
            <motion.div
              key={stock._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 p-6 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-green-500" />
                {stock.nom}
              </h2>

              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Produit :</strong> {stock.produit?.libelle || <em className="text-red-400">Inconnu</em>}</p>
                <p><strong>Quantité :</strong> {stock.produit?.quantite  || <em className="text-red-400">Inconnu</em>} kg</p>
                <p><strong>Entrée :</strong> {formatDate(stock.dateEntree)}</p>
                <p><strong>Sortie :</strong> {stock.dateSortie ? formatDate(stock.dateSortie) : "Non définie"}</p>
                <p className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-green-400" />
                  <span>Température : {stock.temperature}°C</span>
                </p>
               <p><strong>conformité :</strong> {stock.produit?.conformite || <em className="text-red-400">Inconnu</em>}</p>

              </div>

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => handleEditClick(stock)}
                  className="text-green-600 hover:text-green-800 hover:bg-green-100 p-1 rounded-full"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(stock._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
               <div className="mt-4 flex justify-end gap-2">
  <button
    onClick={() => handleValoriser(stock.produit?._id)}
    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
  >
    Valoriser
  </button>
  <button
    onClick={() => handleEliminer(stock.produit?._id)}
    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
  >
    Éliminer
  </button>
</div>
            </motion.div>
          ))
        )}
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Modifier le stock</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editingStock?.nom}
                onChange={(e) =>
                  setEditingStock({ ...editingStock, nom: e.target.value })
                }
                placeholder="Nom du stock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                value={editingStock?.temperature}
                onChange={(e) =>
                  setEditingStock({
                    ...editingStock,
                    temperature: parseFloat(e.target.value),
                  })
                }
                placeholder="Température"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <button
                onClick={handleUpdate}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {addModalOpen && (
        <StockFormModal
          onClose={() => setAddModalOpen(false)}
          onStockAdded={handleAddStock}
        />
      )}
    </div>
  );
};

export default StockCardList2;
