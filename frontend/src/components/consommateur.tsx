import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useCart } from "../types/CartContext";
import { toast } from "react-toastify";
import OrderModal from "../components/ordermodal";
import { useNavigate } from "react-router-dom"; // pour la navigation
import axios from "axios";
import { LogOut } from "lucide-react";
import ChatBot from "./ChatBot";
import ChatLayout from "./ChatLayout";


const ConsumerTracePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [transporters, setTransporters] = useState<any[]>([]);
  const { cart, addToCart, removeFromCart } = useCart();
const navigate = useNavigate();

 const [successMessage, setSuccessMessage] = useState("");
const role = 'Seller' ; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produits = await api.getproduits();
        const transports = await api.getUsersByRole('Transporter');
        setProducts(produits);
        setTransporters(transports);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };
    fetchData();
  }, []);

  const openProductModal = async (id: string) => {
    try {
      const res = await api.getProduitById(id);
      setSelectedProduct(res.produit);
      setQrCodeImage(res.qrCodeImage);
      setIsModalOpen(true);
    } catch {
      setError("Erreur lors de la récupération du produit.");
    }
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenOrderModal = () => {
    if (cart.length === 0) {
      toast.info("Ajoutez des produits au panier avant de commander.");
      return;
    }
    setIsOrderModalOpen(true);
  };

  const handleLogout = async () => {
  try {
    // Appel à l’API pour changer l’état en `inactif`
    const token = localStorage.getItem('token');
    await axios.post(
      'https://agritrace.azizarfaoui.ip-ddns.com/api/auth/logout',
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
  <ChatLayout role="Seller" />
    <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
  <div className="flex justify-end">
  <button
    onClick={handleLogout}
    className="flex items-center space-x-2 text-black-600 hover:text-black-800 transition-colors"
  >
    <LogOut className="h-5 w-5" />
    <span className="text-sm font-medium">Déconnexion</span>
  </button>
</div>

      <h1 className="text-4xl font-bold text-center text-green-700">🌿 Produits disponibles</h1>
      
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mt-6 text-center">
  <button
    onClick={() => navigate("/orderlistseller")}
    className="text-blue-600 hover:text-blue-800 font-semibold underline transition"
  >
    👉 Mes commandes
  </button>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
         <div
  key={product._id}
  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col text-sm"
>
  {product.image && (
    <img
      src={`http://localhost:5000/uploads/${product.image}`}
      alt={product.name}
      className="w-full h-40 object-cover"
    />
  )}
  <div className="p-4 flex-1 flex flex-col justify-between">
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">{product.libelle}</h2>
      <p className="text-sm text-gray-600">Quantité : {product.quantite}</p>
      <p className="text-sm text-gray-600">État : {product.etat}</p>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <button
        onClick={() => openProductModal(product._id)}
        className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition"
      >
        Voir détails
      </button>
      <button
        onClick={() => addToCart(product)}
        className="bg-green-700 text-white text-sm px-3 py-1.5 rounded hover:bg-green-800 transition"
      >
        🛒 Ajouter
      </button>
    </div>
  </div>
</div>

        ))}
      </div>

      {/* Modal produit */}
     {isModalOpen && selectedProduct && (
  <div
    className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4"
    onClick={closeProductModal}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-6 relative"
    >
      <h2 className="text-3xl font-bold text-green-800 border-b pb-2">
        {selectedProduct.name}
      </h2>

      {/* Image du produit */}
      {selectedProduct.variety?.image && (
        <img
          src={`http://localhost:5000/uploads/${selectedProduct.variety.image}`}
          alt={selectedProduct.variety.name}
          className="w-full h-60 object-cover rounded-xl shadow-sm"
        />
      )}

      <div className="space-y-2 text-gray-700 text-base">
        <p><span className="font-semibold">📦 Parcelle :</span> {selectedProduct.parcel?.nom || "N/A"}</p>
        <p><span className="font-semibold">👨‍🌾 Producteur :</span> {selectedProduct.parcel?.user.email || "N/A"}</p>
      </div>

      {/* QR Code */}
      {qrCodeImage && (
        <div className="flex justify-center">
          <img
            src={qrCodeImage}
            alt="QR Code"
            className="w-32 h-32 bg-white p-2 rounded shadow"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={closeProductModal}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
        >
          ✖ Fermer
        </button>
        <button
          onClick={() => {
            addToCart(selectedProduct);
            closeProductModal();
          }}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          🛒 Ajouter au panier
        </button>
      </div>
    </div>
  </div>
)}

   {successMessage && (
  <div className="bg-green-200 text-green-800 p-3 rounded mb-4">
    {successMessage}
    <button
      onClick={() => setSuccessMessage("")}
      className="ml-4 font-bold"
    >
      ✕
    </button>
  </div>
)}


      {/* Panier + bouton commande */}
     <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-3 rounded-t-lg flex flex-col md:flex-row justify-between items-center z-40 max-w-7xl mx-auto text-sm">
  <h2 className="text-xl font-semibold mb-2 md:mb-0">🛒 Panier</h2>
  {cart.length > 0 ? (
    <>
      <ul className="flex flex-wrap gap-2 overflow-x-auto max-w-[65vw]">
        {cart.map((item) => (
          <li
            key={item._id}
            className="bg-white text-black px-2 py-1 rounded shadow flex items-center gap-2 text-xs"
          >
            <span>{item.libelle} (x{item.quantity})</span>
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 hover:text-red-800 font-bold px-1 py-0.5 bg-red-100 rounded"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleOpenOrderModal}
        disabled={loading}
        className="mt-2 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
      >
        {loading ? "Chargement..." : "Commander"}
      </button>
    </>
  ) : (
    <p className="text-sm">Le panier est vide.</p>
  )}
</div>


      {/* Modal commande */}
     <OrderModal
  isOpen={isOrderModalOpen}
  onClose={() => setIsOrderModalOpen(false)}
  transporters={transporters}
  selectedProducts={cart.map((item) => ({
    product: item._id,
    quantite: item.quantite,
    libelle: item.libelle,
    parcel: item.parcel,
    qrCode: item.qrCode,
    etat: item.etat,
  //user: parcel.user?._id, // ⚠️ bien envoyer uniquement l’ID ici
  user:item.parcel.user._id,
   }))}
  onSubmit={async ({ transporter, deliveryDate, products }) => {
    try {
      setLoading(true);
      
      const farmerId = cart[0]?.parcel?.user?._id;

      //const farmerId = cart[0]?.user?._id || cart[0]?.farmerId;
      await api.createOrder({
        deliveryDate: new Date(deliveryDate),
        farmer: farmerId,
        transporter,
        products,
        status: "",
      });
setSuccessMessage("Commande passée avec succès 🎉");
      cart.forEach((item) => removeFromCart(item._id));
      setIsOrderModalOpen(false);
    } 
    catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi de la commande.");
    } finally {
      setLoading(false);
    }
  }}
/>
       
    </div>
    </div>
  );
};

export default ConsumerTracePage;
