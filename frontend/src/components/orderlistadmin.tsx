import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Farmer {
  nom: string;
  email: string;
}

interface Transporter {
  nom: string;
  email: string;
}
interface Seller {
  nom: string;
  email: string;
}

export interface CreateProduitData {
  libelle: string;
  quantite: number;
  parcel: string;
  qrCode: string;
  etat: string;
}

interface Order {
  _id: string;
  deliveryDate: string;
  farmer: Farmer;
  transporter?: Transporter;
  products: CreateProduitData[];
  status: string;
  seller: Seller;
}

const OrdersPageAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://agritrace.azizarfaoui.ip-ddns.com/api/order/all');
      setOrders(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-block px-3 py-1 text-sm font-semibold rounded-full text-white";

    switch (status) {
      case 'Enattente':
        return <span className={`${baseClasses} bg-yellow-500`}>En attente</span>;
      case 'validee':
        return <span className={`${baseClasses} bg-blue-500`}>Validée</span>;
      case 'Encours':
        return <span className={`${baseClasses} bg-green-600`}>En cours de livraison</span>;
        case 'Livree':
        return <span className={`${baseClasses} bg-green-600`}>Livré</span>;
      default:
        return <span className={`${baseClasses} bg-gray-400`}>{status}</span>;
    }
  };

  // Fonction pour formater la date en français, ex: "30 mai 2025"
  const formatDateFR = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">📦 Commandes</h1>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm tracking-wider">
            <tr>
              <th className="py-4 px-6 text-left">📅 Livraison</th>
              <th className="py-4 px-6 text-left">👨‍🌾 Vendeur</th>
              <th className="py-4 px-6 text-left">🚚 Transporteur</th>
              <th className="py-4 px-6 text-left">🛒 Produits</th>
              <th className="py-4 px-6 text-left">📍 Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500 italic">
                  Aucune commande pour le moment.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  title={`Commande ID: ${order._id}`}
                >
                  <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-800">
                    {formatDateFR(order.deliveryDate)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-700">{order.seller?.email || '—'}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-700">{order.transporter?.email || '—'}</td>
                  <td className="py-4 px-6 max-w-xs text-gray-700">
                    <ul className="list-disc list-inside space-y-1">
                      {(order.products ?? []).map((product, index) => (
                        <li key={index} className="truncate">
                          <span className="font-semibold">{product.libelle}</span> — Quantité: {product.quantite}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPageAdmin;
