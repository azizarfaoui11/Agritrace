  import React, { useEffect, useState } from 'react';
  import { api } from '../services/api';
  import { useCart } from '../types/CartContext';


  const ConsumerTracePage: React.FC = () => {
    const [lots, setLots] = useState<any[]>([]);
    const [selectedLot, setSelectedLot] = useState<any | null>(null);
   // const [cart, setCart] = useState<any[]>([]);
    const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
    const [searchId, setSearchId] = useState('');
    const [error, setError] = useState('');

  const { addToCart } = useCart();
  //console.log("addToCart function:", addToCart);
    


    useEffect(() => {
      const fetchLots = async () => {
        try {
          const res = await api.getLots();
          setLots(res);
        } catch {
          setError("Erreur lors du chargement des lots.");
        }
      };
      fetchLots();
    }, []);

  const handleSearch = async () => {
    try {
      const res = await api.getLotByName(searchId.trim());
      setSelectedLot(res.lot);
      setQrCodeImage(res.qrCodeImage); // ou retire si pas généré ici
      setError('');
    } catch {
      setError("Lot non trouvé ou erreur serveur.");
    }
  };

  const handleAddToCart = (lot: any) => {
    addToCart(lot);
  };


    const handleLotClick = async (lotId: string) => {
      try {
        const res = await api.getLotById(lotId);
        setSelectedLot(res.lot);
        setQrCodeImage(res.qrCodeImage);
        setError('');
      } catch {
        setError("Erreur lors du chargement du lot.");
      }
    };

    return (
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-green-700">🌿 Traçabilité des Produits</h1>

        {/* Recherche */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            type="text"
            placeholder="🔎 Recherchez par Nom de lot"
            className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-96 shadow-sm focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition duration-300 shadow"
          >
            Rechercher
          </button>
        </div>

        {/* Lots disponibles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lots.map((lot) => (
            
            <div
            
              key={lot._id}
              onClick={() => handleLotClick(lot._id)}
              className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-transform duration-300 transform hover:scale-105 p-4 space-y-3"
            >
              <h2 className="text-xl font-bold text-green-800">{lot.name}</h2>
              <button
    onClick={(e) => {
      e.stopPropagation();
      console.log("✅ Click détecté sur Ajouter au panier");
      handleAddToCart(lot);
    }}
    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 hover:scale-105 transition-transform duration-200"
  >
    🛒 Ajouter au panier
  </button>


              <p className="text-sm text-gray-500">ID : {lot._id}</p>
              {lot.image && (
                <img
                  src={`http://localhost:5000/uploads/${lot.image}`}
                  alt={lot.name}
                  className="w-full h-36 object-cover rounded-md"
                />
              )}

          <div>
            
            
          </div>
        
            </div>
            
            
            
          ))}
              
        </div>
        

        {/* Affichage des erreurs */}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Détails du lot sélectionné */}
        {selectedLot && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-xl animate-fade-in space-y-6">
            <h2 className="text-3xl font-bold text-green-700">{selectedLot.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Infos générales */}
              <div className="space-y-3">
                <p><span className="font-semibold">ID :</span> {selectedLot._id}</p>
                <p><span className="font-semibold">Date de récolte :</span> {new Date(selectedLot.harvestDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Méthode de production :</span> {selectedLot.producerMethod}</p>
                <p><span className="font-semibold">Variété :</span> {selectedLot.variety?.name}</p>
                <p><span className="font-semibold">Agriculteur :</span> {selectedLot.user?.email}</p>
                <p><span className="font-semibold">Tel :</span> {selectedLot.user?.telephone}</p>

              </div>
          


              {/* Image variété */}
              {selectedLot.variety?.image && (
              <img
                src={`http://localhost:5000/uploads/${selectedLot.variety?.image}`}
                alt={selectedLot.variety.name}
                className="w-full h-40 object-cover rounded-xl -mt-8 mb-4 shadow"
              />
            )}
            </div>

          {/* Données environnementales */}
  <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold text-green-800 mb-4">🌍 Impact Environnemental</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-800">
      <div className="flex flex-col items-center bg-white p-3 rounded shadow">
        <span className="font-bold text-green-700">Eau</span>
        <span>{selectedLot.environmentImpact?.waterUsage || '--'} L</span>
      </div>
      <div className="flex flex-col items-center bg-white p-3 rounded shadow">
        <span className="font-bold text-green-700">Énergie</span>
        <span>{selectedLot.environmentImpact?.energy || '--'} kWh</span>
      </div>
      <div className="flex flex-col items-center bg-white p-3 rounded shadow">
        <span className="font-bold text-green-700">CO₂</span>
        <span>{selectedLot.environmentImpact?.co2Emission || '--'} kg</span>
      </div>
      <div className="flex flex-col items-center bg-white p-3 rounded shadow">
        <span className="font-bold text-green-700">Pesticides</span>
        <span>{selectedLot.environmentImpact?.pesticides || 'Non spécifié'}</span>
      </div>
    </div>
  </div>


            {/* QR code + blockchain */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-6">
              {qrCodeImage && (
                <img
                  src={qrCodeImage}
                  alt="QR Code"
                  className="w-40 h-40 border border-gray-200 rounded"
                />
              )}
              <div className="text-center sm:text-left space-y-2 text-green-700">
                <p className="font-medium">✅ Enregistré sur la blockchain Ethereum</p>
                {selectedLot.txHash && (
                  <a
                    href={`https://etherscan.io/tx/${selectedLot.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Voir la transaction
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default ConsumerTracePage;
