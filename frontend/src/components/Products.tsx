import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CubeIcon } from '@heroicons/react/24/outline';
import ChatBott from './ChatBott';

const ProduitList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const role = 'consommateur';

  const fetchProducts = async () => {
    try {
      const res = await api.getProducts();
      setProducts(res);
    } catch (err) {
      setError('Erreur lors de la récupération des produits.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
   
    <div className="flex min-h-screen">
      {/* 🟩 Colonne gauche : Cards (70%) */}
      <div className="w-[57%] p-6 overflow-y-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Produits disponibles
        </h2>

        {isLoading ? (
          <div className="text-center text-blue-600 font-semibold text-lg">Chargement...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow text-center">{error}</div>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Aucun produit trouvé.</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-start">
            {products.map((product) => (
              <div
                key={product._id}
                className="w-full md:w-[48%] lg:w-[45%] bg-white shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden"
              >
                {product.image && (
                  <div className="w-full h-48">
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.libelle}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-4 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-green-100 text-green-600 p-1 rounded-full">
                      <CubeIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{product.libelle}</h3>
                  </div>

                  <p className="text-sm text-gray-600">Quantité : {product.quantite}</p>
                  {product.user && (
                    <p className="text-sm text-gray-400 mt-1">Producteur : {product.user.email}</p>
                  )}
                  {product.isActive !== undefined && (
                    <p className="text-sm mt-1">
                      Statut :
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
                          product.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </p>
                  )}

                  {product.qrCodeImage && (
                    <div className="absolute bottom-3 right-3">
                      <img
                        src={product.qrCodeImage}
                        alt="QR Code"
                        className="w-14 h-14 border rounded-md"
                        style={{ width: 130, height: 90 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🖼️ Colonne droite : Image (30%) */}
      <div className="w-[43%] hidden md:block">
        <img
          src="/consumer.jpg"
          alt="Illustration"
          className="object-cover w-full h-full"
        />
      </div>
        <div className="fixed bottom-6 right-6 z-50">
  <ChatBott role={role} conversationId={null} />
</div>
    </div>
    
  );
};

export default ProduitList;
