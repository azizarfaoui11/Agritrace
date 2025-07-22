import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FaBoxOpen } from 'react-icons/fa';

const FaBoxIcon = FaBoxOpen as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

interface Product {
  _id: string;
  libelle: string;
  quantite: string;
  parcel: {
      _id: string;
      nom: string;
  };
  image?: string;


}

const MyProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .fetchMyProducts(token)
      .then((data) => setProducts(data))
      .catch((err) => console.error('Erreur lors de la récupération des produits :', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        📦 Mes Produits
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center">Aucun produit trouvé.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((product) => (
           <div
  key={product._id}
  className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg"
>
  {product.image && (
    <img
      src={`http://localhost:5000/uploads/${product.image}`}
      alt={product.libelle}
      className="w-full h-40 object-cover rounded-md mb-3"
    />
  )}
  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
    <FaBoxIcon className="text-blue-500 mr-2" />
    {product.libelle}
  </h3>
  <p className="text-sm text-gray-700 mb-1">
    🏷️ Parcelle : <strong>{product.parcel?.nom}</strong>
  </p>
  <p className="text-sm text-gray-700">
    📦 Quantité : <strong>{product.quantite}</strong>
  </p>
</div>


          ))} 
        </div>
      )}
    </div>
  );
};

export default MyProducts;
