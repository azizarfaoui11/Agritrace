import React, { useState, useEffect } from "react";
import axios from "axios";
import { Leaf, AlertCircle } from "lucide-react";
import { api } from "../services/api";

// Nouvelle structure enrichie des véhicules
const VEHICLE_EMISSIONS: Record<
  string,
  {
    emission: number;
    marque: string;
    modele: string;
    charge: number;
    carburant: string;
  }
> = {
  "178 TU ****": {
    emission: 225,
    marque: "Iveco",
    modele: "Daily Type 35C15/E3",
    charge: 3.5,
    carburant: "Gazoil",
  },
  "189 TU *****": {
    emission: 240,
    marque: "Iveco",
    modele: "Daily Fourgon 35-150",
    charge: 4.9,
    carburant: "Gazoil",
  },
  "190 TU ****": {
    emission: 160,
    marque: "Volkswagen",
    modele: "Caddy Cargo",
    charge: 0.77,
    carburant: "Gazoil",
  },
  "238 TU ****": {
    emission: 180,
    marque: "Tata",
    modele: "Xenon Simple Cabine",
    charge: 1.21,
    carburant: "Gazoil",
  },
};

const ExpeditionModal = ({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    dateExpedition: "",
    distance: "",
    typevehicule: "",
    quantite: 0,
  });

  const [emissionCO2, setEmissionCO2] = useState<number | null>(null);
  const [produitsIds, setProduitsIds] = useState<string[]>([]);


  useEffect(() => {
    const { distance, typevehicule } = formData;
    const distanceNum = parseFloat(distance);
    const vehicle = VEHICLE_EMISSIONS[typevehicule];
    const emissionPerKm = vehicle?.emission;

    if (!isNaN(distanceNum) && emissionPerKm !== undefined) {
      const total = (emissionPerKm * distanceNum) / 1000;
      setEmissionCO2(total);
    } else {
      setEmissionCO2(null);
    }
  }, [formData.distance, formData.typevehicule]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

const ids = data.products.map((p: any) => p._id); // ✅ simple et fonctionnel
      console.log("IDs des produits récupérés :", ids); // 🔍 debug
      setProduitsIds(ids);
    } catch (err) {
      console.error("Erreur lors de la récupération de la commande", err);
    }
  };

  fetchOrderDetails();
}, [orderId]);


  const handleCreateExpedition = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/expeditions/create",
        { ...formData, order: orderId, emissionCO2 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await axios.put(
        `http://localhost:5000/api/order/${orderId}/acceptt`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (emissionCO2 !== null) {
  for (const produitId of produitsIds) {
    await api.updateProduitCarbone(produitId, emissionCO2.toFixed(2));
  }
}

      onClose();
    } catch (err) {
      console.error("Erreur d'expédition :", err);
    }
  };

  const selectedVehicle = VEHICLE_EMISSIONS[formData.typevehicule];
  const emission = selectedVehicle?.emission;
  const isEco = emission !== undefined && emission < 200;
  const isPolluant = emission !== undefined && emission >= 200;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[420px] animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-4 text-green-700">
          🚚 Nouvelle Expédition
        </h2>

        <div className="space-y-3">
          <input
            type="date"
            name="dateExpedition"
            className="w-full p-2 border rounded-md"
            onChange={handleChange}
          />

          <input
            type="text"
            name="distance"
            placeholder="Distance (km)"
            className="w-full p-2 border rounded-md"
            onChange={handleChange}
          />

          <select
            name="typevehicule"
            className="w-full p-2 border rounded-md"
            onChange={handleChange}
          >
            <option value="">-- Sélectionner un véhicule --</option>
            {Object.keys(VEHICLE_EMISSIONS).map((matricule) => {
              const v = VEHICLE_EMISSIONS[matricule];
              return (
                <option key={matricule} value={matricule}>
                  {matricule} - {v.marque} {v.modele}
                </option>
              );
            })}
          </select>

          {formData.typevehicule && selectedVehicle && (
            <div className="text-sm space-y-1 border rounded-md p-2 bg-gray-50">
              <p>
                <strong>Marque :</strong> {selectedVehicle.marque}
              </p>
              <p>
                <strong>Modèle :</strong> {selectedVehicle.modele}
              </p>
              <p>
                <strong>Charge utile :</strong> {selectedVehicle.charge} T
              </p>
              <p>
                <strong>Carburant :</strong> {selectedVehicle.carburant}
              </p>
              <p>
                <strong>Émission :</strong> {selectedVehicle.emission} g/km
              </p>

              {isEco && (
                <p className="flex items-center text-green-600 font-semibold">
                  <Leaf className="w-4 h-4 mr-1" /> Véhicule éco
                </p>
              )}
              {isPolluant && (
                <p className="flex items-center text-red-600 font-semibold">
                  <AlertCircle className="w-4 h-4 mr-1" /> Véhicule polluant
                </p>
              )}
            </div>
          )}

          <input
            type="number"
            name="quantite"
            placeholder="Quantité"
            className="w-full p-2 border rounded-md"
            onChange={handleChange}
          />

          {emissionCO2 !== null && (
            <div className="text-blue-700 font-medium">
              🌍 Estimation CO₂ :{" "}
              <strong>{emissionCO2.toFixed(2)} kg</strong>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={handleCreateExpedition}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpeditionModal;
