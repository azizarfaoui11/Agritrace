import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // pour la navigation
import { api } from "../services/api";
import { motion } from "framer-motion";
import ZoneModal from "./ZoneFormModal"; // adapte le chemin selon ton projet

import {
  Warehouse,
  Info,
  Boxes,
  ThermometerSnowflake,
  SunMedium,
  Droplets,
  Pencil,
  Trash2,
  LogOut
} from "lucide-react";
import axios from "axios";

const ZoneList = () => {
  const [zones, setZones] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);


  const navigate = useNavigate();


  const fetchZones = async () => {
    try {
      const data = await api.getAllZones();
      setZones(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des zones :", error);
    }
  };

  const openEditModal = (zone: any) => {
    setSelectedZone(zone);
    setShowModal(true);
  };
  const closeModal = () => {
    setSelectedZone(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette zone ?")) {
      try {
        await api.deleteZone(id);
        fetchZones();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleLogout = async () => {
  try {
    // Appel à l’API pour changer l’état en `inactif`
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Suppression du token local
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 


    // Redirection
    navigate('/login');
  } catch (err) {
    console.error('Erreur de déconnexion', err);
  }
};


  const getZoneStyle = (type: string) => {
    switch (type) {
      case "refroidissement":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "sec":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "tempere":
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "refroidissement":
        return "bg-blue-600 text-white";
      case "sec":
        return "bg-yellow-500 text-white";
      case "tempere":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case "refroidissement":
        return <ThermometerSnowflake className="w-6 h-6 text-blue-500" />;
      case "sec":
        return <SunMedium className="w-6 h-6 text-yellow-500" />;
      case "tempere":
        return <Droplets className="w-6 h-6 text-green-500" />;
      default:
        return <Warehouse className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
        <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-black-600 hover:text-black-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <Warehouse className="w-7 h-7 text-gray-600" />
        Zones de Stockage
      </h2>

      <div className="flex justify-end mb-6">
       <button
  onClick={() => setShowModal(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
>
  + Ajouter une zone
</button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-9">
        {zones.map((zone, index) => (
          <motion.div
            key={zone._id}
onClick={() => {
  switch (zone.typeZone) {
    case "refroidissement":
      navigate("/stocklist");
      break;
    case "sec":
      navigate("/stocklist1");
      break;
    case "tempere":
      navigate("/stocklist2");
      break;
    default:
      navigate("/zones/autre");
  }
}}            className={`relative p-6 border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${getZoneStyle(zone.typeZone)}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {getZoneIcon(zone.typeZone)}
                {zone.name}
              </h3>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${getBadgeColor(zone.typeZone)}`}
              >
                {zone.typeZone}
              </span>
            </div>

            <p className="text-sm mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Description :</span>{" "}
              {zone.description || "—"}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Boxes className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Capacité max :</span>{" "}
              {zone.capaciteMax || "—" } <h3>kg</h3>
            </p>

            <div className="flex gap-3 mt-4 ml-auto justify-end">
               <Pencil
            className="w-5 h-5 text-green-600 cursor-pointer hover:text-green-800 transition"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(zone); // ouvrir le modal avec cette zone
            }}
          />
              <Trash2
                className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(zone._id);
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-20 text-center">
  <button
    onClick={() => navigate("/orderliststock")}
    className="text-blue-600 hover:text-blue-800 font-semibold underline transition"
  >
    👉 tous les commandes
  </button>
</div>
       {showModal && (
  <ZoneModal
    onClose={() => setShowModal(false)}
    onZoneAdded={fetchZones}
  />
)}
 {showModal && (
        <ZoneModal
          zone={selectedZone}
          onClose={closeModal}
        />
      )}
    </motion.div>
  );
 

};

export default ZoneList;
