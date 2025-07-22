import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./ExpeditionModal";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TransporterOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/order/shipped", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleValidate = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Erreur de déconnexion", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "expédié":
        return "bg-green-100 text-green-700";
      case "en attente":
        return "bg-yellow-100 text-yellow-700";
      case "annulé":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Commandes à Expédier</h2>
        <p className="text-gray-600">Liste des commandes prêtes pour l'expédition</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">Aucune commande à expédier.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Date de livraison</th>
                <th className="px-6 py-3 text-left">Agriculteur</th>
                <th className="px-6 py-3 text-left">Produits</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {new Date(order.deliveryDate).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">{order.farmer?.nom || "N/A"}</td>
                  <td className="px-6 py-4">
                    <ul className="list-disc list-inside space-y-1">
                      {order.products.map((p: any) => (
                        <li key={p._id}>
                          {p.libelle} <span className="text-gray-500">({p.quantite} kg)</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status || "N/A"
                      )}`}
                    >
                      {order.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleValidate(order._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
                    >
                      Livrer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedOrderId && (
        <Modal
          orderId={selectedOrderId}
          onClose={() => {
            setShowModal(false);
            setSelectedOrderId(null);
          }}
        />
      )}
    </div>
  );
};

export default TransporterOrders;
