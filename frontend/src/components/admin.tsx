import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminWelcomePage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/stat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full text-center">
        <img src="/adlin.png" alt="Admin dashboard" className="rounded-xl w-full h-56 object-cover mb-6" />

        <h1 className="text-3xl font-extrabold text-green-800 mb-4">
          Welcome to our Admin Panel for AgriTrace 🌾
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          This space allows you to monitor, manage and maintain the traceability of agricultural products.
        </p>
        <button
          onClick={handleRedirect}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-full shadow hover:bg-green-700 transition-all duration-200"
        >
          Go to Statistics
        </button>
      </div>
    </div>
  );
};

export default AdminWelcomePage;
