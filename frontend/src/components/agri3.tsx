import React, { useState, Fragment } from 'react';
import {
  PackagePlus,
  MapPin,
  Leaf,
  Sprout,
  LogOut,
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

import MyParcels from './myparcels';
import MyVarieties from './myvaritys';
import CreateParcelPage from './createparcel';
import CreateVarietyPage from './createvarieties';
import CreateProduit from './createproduit';
import CreateCulture from './createculture';
import CreateTraitement from './createtraitement';
import MyProducts from './myproducts';
import MyCultures from './mycultures';
import MyTraitements from './mytrait';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';
import ChatLayout from './ChatLayout';

const FarmerDashboard = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [isParcelModalOpen, setIsParcelModalOpen] = useState(false);
  const [isVarietyModalOpen, setIsVarietyModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
    const [isCultureModalOpen, setIsCultureModalOpen] = useState(false);
  const [isProduitModalOpen, setIsProduitModalOpen] = useState(false);
  const [isTraitModalOpen, setIsTraitModalOpen] = useState(false);
  const navigate = useNavigate(); 


  const role='Farmer';



  const sections = [
   { name: 'produits' , icon: <Leaf className="h-6 w-6" />, key: 'produits' },
    { name: 'Parcelles', icon: <MapPin className="h-6 w-6" />, key: 'parcels' },
     { name: 'cultures', icon: <Leaf className="h-6 w-6" />, key: 'cultures' },

    { name: 'Variétés', icon: <Sprout className="h-6 w-6" />, key: 'variety' },
    { name: 'traitement', icon: <Leaf className="h-6 w-6" />, key: 'traitement' },



  ];

  const handleSectionClick = (key: string) => {
    setActiveSection(key);
    switch (key) {
      
      case 'parcels':
        setIsParcelModalOpen(true); break;
      case 'variety':
        setIsVarietyModalOpen(true); break;
        case 'produits':
        setIsProduitModalOpen(true); break;
         case 'cultures':
        setIsCultureModalOpen(true); break;
        case 'traitement':
        setIsTraitModalOpen(true); break;

        
      default: break;
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

  return (
    <div className="relative">
  <ChatLayout role="Farmer" />
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-8">
      <div className="flex justify-end">
  <button
    onClick={handleLogout}
    className="flex items-center space-x-2 text-black-600 hover:text-black-800 transition-colors"
  >
    <LogOut className="h-5 w-5" />
    <span className="text-sm font-medium">Déconnexion</span>
  </button>
</div>
 

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-2xl space-y-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-green-800">
          Tableau de Bord Agriculteur
        </h2>

        {/* Boutons de création */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => handleSectionClick(section.key)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl shadow hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                activeSection === section.key ? 'bg-green-300' : 'bg-white'
              }`}
            >
              <div className="text-green-600">{section.icon}</div>
              <span className="mt-2 text-sm font-semibold text-gray-700">{section.name}</span>
            </button>
          ))}
        </div>

        {/* Contenu dynamique */}
        {activeSection && (
          <div className="text-center text-gray-600 font-medium italic mt-4">
            Section active : <span className="text-green-700 font-semibold">{activeSection}</span>
          </div>
        )}

        {/* Affichage des entités */}
        <section className="grid gap-8 mt-8">
          
          <div className="bg-gray-100 p-6 rounded-2xl shadow-sm">
            <MyParcels />
          </div>
          <div className="bg-gray-100 p-6 rounded-2xl shadow-sm">
            <MyVarieties />
          </div>
         
          <div className="bg-gray-100 p-6 rounded-2xl shadow-sm">
            <MyProducts />
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow-sm">
            <MyCultures />
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow-sm">
            <MyTraitements />
          </div>
        </section>

       

      </div>

      {/* Modales */}
      
      <ModalWrapper isOpen={isParcelModalOpen} setIsOpen={setIsParcelModalOpen}>
        <CreateParcelPage />
      </ModalWrapper>
      <ModalWrapper isOpen={isVarietyModalOpen} setIsOpen={setIsVarietyModalOpen}>
        <CreateVarietyPage />
      </ModalWrapper>
      <ModalWrapper isOpen={isProduitModalOpen} setIsOpen={setIsProduitModalOpen}>
        <CreateProduit />
      </ModalWrapper>
      <ModalWrapper isOpen={isCultureModalOpen} setIsOpen={setIsCultureModalOpen}>
        <CreateCulture />
      </ModalWrapper>
      <ModalWrapper isOpen={isTraitModalOpen} setIsOpen={setIsTraitModalOpen}>
        <CreateTraitement />
      </ModalWrapper>
       
    </div>
    </div>
  );
};

// Composant modal réutilisable
const ModalWrapper = ({ isOpen, setIsOpen, children }: any) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default FarmerDashboard;
