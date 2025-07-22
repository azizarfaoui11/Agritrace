import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { motion } from "framer-motion";

const ZoneFormModal = ({ zone, onClose }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capaciteMax: "",
    typeZone: "refroidissement",
  });

  const [errors, setErrors] = useState({
    name: "",
    capaciteMax: "",
  });

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name || "",
        description: zone.description || "",
        capaciteMax: zone.capaciteMax?.toString() || "",
        typeZone: zone.typeZone || "refroidissement",
      });
    }
  }, [zone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // reset error
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis.";
    if (Number(formData.capaciteMax) < 0) newErrors.capaciteMax = "La capacité doit être positive.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...formData,
      capaciteMax: Number(formData.capaciteMax),
    };

    try {
      zone ? await api.updateZone(zone._id, data) : await api.createZone(data);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {zone ? "Modifier la zone" : "Ajouter une zone"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la zone *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Capacité max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacité maximale *
            </label>
            <input
              type="number"
              name="capaciteMax"
              value={formData.capaciteMax}
              onChange={handleChange}
              min={0}
              className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.capaciteMax ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.capaciteMax && (
              <p className="text-red-500 text-sm">{errors.capaciteMax}</p>
            )}
          </div>

          {/* Type de zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de zone *
            </label>
            <select
              name="typeZone"
              value={formData.typeZone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="refroidissement">Refroidissement</option>
              <option value="sec">Sec</option>
              <option value="tempere">Tempéré</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              {zone ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ZoneFormModal;
