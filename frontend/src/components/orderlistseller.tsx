import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../services/api';

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
      const res = await axios.get('https://agritrace.azizarfaoui.ip-ddns.com/api/order/mine');
      setOrders(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enattente':
        return 'bg-yellow-400';
      case 'validee':
        return 'bg-blue-400';
      case 'Encours':
        return 'bg-orange-400';
      case 'Livree':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Commandes</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-xl">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">📅 Livraison</th>
              <th className="py-3 px-4 text-left">🚚 Transporteur</th>
              <th className="py-3 px-4 text-left">🛒 Produits</th>
              <th className="py-3 px-4 text-left w-40">📍 Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 text-sm">
                  Aucune commande pour le moment.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-50 align-top"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {order.transporter ? (
                      <>
                        <div className="font-medium text-gray-900">{order.transporter.nom}</div>
                        <div className="text-xs text-gray-500">{order.transporter.email}</div>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Non assigné</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <ul className="space-y-0.5">
                      {order.products.map((product, index) => (
                        <li key={index}>
                          <span className="font-semibold">{product.libelle}</span> – {product.quantite} kg
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`text-white px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>


                         {order.status === 'Encours' && (
                        <button
                          onClick={async () => {
                            try {
                              await api.acceptOrderr(order._id);
                              fetchOrders(); // recharge les commandes
                            } catch (err) {
                              console.error('Erreur lors de l\'acceptation de la commande', err);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded shadow"
                        >
                          Tout est bon
                        </button>
                      )}
                     
                    </div>
                  </td>
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
