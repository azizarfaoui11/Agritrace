import React, { useState, useEffect } from "react";

interface Transporter {
  _id: string;
  email: string;
}

export interface CreateProduitData {

  libelle:string;
  quantite: number;
  parcel:string;
  qrCode: string;
  etat:string;

}
interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  transporters: Transporter[];
  selectedProducts: CreateProduitData[];
  onSubmit: (data: {
    transporter: string;
    deliveryDate: string;
    products: CreateProduitData[];
  }) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  transporters,
  selectedProducts,
  onSubmit,
}) => {
  const [transporter, setTransporter] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setTransporter("");
      setDeliveryDate("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transporter || !deliveryDate) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    onSubmit({ transporter, deliveryDate, products: selectedProducts });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full space-y-4">
        <h2 className="text-2xl font-bold text-center text-green-700">📝 Passer une commande</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Transporteur</label>
            <select
              value={transporter}
              onChange={(e) => setTransporter(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Sélectionner un transporteur --</option>
              {transporters.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Date de livraison</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Produits sélectionnés</label>
            <ul className="list-disc list-inside space-y-1">
              {selectedProducts.map((item, index) => (
                <li key={index}>
                  <span className="font-medium">
                    {/** Tu dois passer le `libelle` dans le mapping */}
                    {item.libelle } — Quantité : {item.quantite}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
