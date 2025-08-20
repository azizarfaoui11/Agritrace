import React, { useState } from "react";
import { FaEnvelope, FaFileAlt, FaHandshake, FaShieldAlt, FaSignInAlt } from "react-icons/fa"; // Icônes ajoutées
import { Link, useNavigate } from "react-router-dom";

const FaFileAltIcon = FaFileAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaHandshakeIcon = FaHandshake as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaShieldAltIcon = FaShieldAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaEnvelopeIcon = FaEnvelope as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaSignInAltIcon = FaSignInAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();  // Déclare la fonction de navigation


  // Fonction pour ouvrir/fermer le modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const goToLogin = () => {
    navigate('/login');  // Redirige vers /login
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/back.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-screen">
        
      <div className="text-center mb-12">
  <h1 className="text-4xl font-extrabold text-white">Bienvenue sur notre plateforme</h1>
  <h2 className="mt-2 text-6xl font-bold text-gradient ">
  Trace Agri 
</h2>

</div>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { name: "Produit", icon: <FaFileAltIcon  />, description: "Suivi des produits en temps réel." },
            { name: "Feedback", icon: <FaHandshakeIcon  />, description: "Votre retour nous interesse ." },
            { name: "Reclamation", icon: <FaShieldAltIcon  />, description: "faites vos reclamations ici." },
          ].map((feature) => (
            <Link key={feature.name} to={`/${feature.name.toLowerCase()}`}>
              <div className="border rounded-lg p-8 shadow-lg bg-white bg-opacity-80 hover:opacity-90 cursor-pointer transition-all duration-300">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-blue-900">{feature.name}</h2>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Icônes en haut à droite pour ouvrir le modal */}
        <div className="absolute top-4 right-4 flex gap-4">
          <button
            onClick={toggleModal}
            className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
          >
            <FaEnvelopeIcon />
          </button>
          <button
            onClick={goToLogin}  // Utiliser goToLogin pour naviguer vers /login
            className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-full"
          >
            <FaSignInAltIcon />
          </button>
        </div>

        {/* Modal pour le formulaire de contact */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="bg-black opacity-50 absolute inset-0" onClick={toggleModal}></div>
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full z-30">
              <h2 className="text-2xl font-bold mb-4 text-blue-900">Contactez-nous</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Adresse email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Votre message"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                />
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-700">J'accepte les conditions d'utilisation</span>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
