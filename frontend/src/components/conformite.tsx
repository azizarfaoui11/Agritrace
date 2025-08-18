import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  libelle: string;
  quantite: number;
  dateEntree: string;
  probleme?: string;
}

const ProductsInOrdersTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://agritrace.azizarfaoui.ip-ddns.com/api/order/productsinorders");
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProblemChange = (index: number, value: string) => {
    const updated = [...products];
    updated[index].probleme = value;
    setProducts(updated);
  };

  const handleValoriser = async (product: Product) => {
    await axios.put(`https://agritrace.azizarfaoui.ip-ddns.com/api/produits/${product._id}/conformite`, {
      conformite: "valoriser",
    });
    setMessage(`le produit avec le libellé  "${product.libelle}" sera valorisé .`);
    setMessageType("success");
    fetchProducts();
  };

  const handleEliminer = async (product: Product) => {
    await axios.put(`https://agritrace.azizarfaoui.ip-ddns.com/api/produits/${product._id}/conformite`, {
      conformite: "eliminer",
    });
    setMessage(`le produit avec le libellé  "${product.libelle}" sera éliminé.`);
    setMessageType("error");
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Produits Livrés</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded border text-sm font-medium ${
            messageType === "success"
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 shadow-sm rounded-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Libellé</th>
              <th className="border px-4 py-2 text-left">Quantité</th>
              <th className="border px-4 py-2 text-left">Date Entrée</th>
              <th className="border px-4 py-2 text-left">Problème détecté</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {products.map((product, index) => {
              const isEliminerDisabled = !product.probleme;

              return (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{product.libelle}</td>
                  <td className="border px-4 py-2">{product.quantite}</td>
                  <td className="border px-4 py-2">
                    {new Date(product.dateEntree).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      value={product.probleme || ""}
                      onChange={(e) => handleProblemChange(index, e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="Périmé">Périmé</option>
                      <option value="Moisissure">Moisissure</option>
                      <option value="Transformation secondaire">Transformation secondaire</option>
                      <option value="Emballage défectueux">Emballage défectueux</option>
                      <option value="Produit écrasé">Produit écrasé</option>
                      <option value="Odeur suspecte">Odeur suspecte</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <div className="flex items-center space-x-2">
                      {/* Valoriser toujours activé */}
                      <button
                        className="px-3 py-1 rounded shadow text-white bg-green-600 hover:bg-green-700"
                        onClick={() => handleValoriser(product)}
                        title="Valoriser ce produit"
                      >
                        Valoriser
                      </button>

                      {/* Éliminer activé seulement si un problème est sélectionné */}
                      <button
                        className={`px-3 py-1 rounded shadow text-white ${
                          isEliminerDisabled
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                        onClick={() => handleEliminer(product)}
                        disabled={isEliminerDisabled}
                        title={
                          isEliminerDisabled
                            ? "Veuillez d'abord sélectionner un problème"
                            : "Éliminer ce produit"
                        }
                      >
                        Éliminer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsInOrdersTable;
