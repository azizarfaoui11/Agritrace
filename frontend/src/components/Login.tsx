import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import * as FaIcons from 'react-icons/fa';

const FaEnvelope = FaIcons.FaEnvelope as React.FC<React.SVGProps<SVGSVGElement>>;
const FaLock = FaIcons.FaLock as React.FC<React.SVGProps<SVGSVGElement>>;
const FaSeedling = FaIcons.FaSeedling as React.FC<React.SVGProps<SVGSVGElement>>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.login(email, password);
      const { token, user } = response;

      if (token && user?.role) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('user', JSON.stringify(user)); 


        switch (user.role) {
          
            case 'Admin':
            navigate('/admin');
            break;
            case 'Farmer':
            navigate('/agriii');
            break;
            case 'Seller':
            navigate('/suivi');
            break;
            case 'Transformateur':
            navigate('/transformateur');
            break;
            case 'StockManager':
            navigate('/zonelist');
            break;
            case 'Transporter':
            navigate('/ordertransporteur');
            break;
          default:
            navigate('/');
        }
      } else {
        setError("Identifiants invalides ou rôle utilisateur manquant");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border-t-4 border-green-600">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-green-800">
          <FaSeedling className="text-3xl" /> Connexion
        </h2>

        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 focus:outline-none"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 focus:outline-none"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full mt-3 text-green-800 font-medium hover:underline"
            disabled={isLoading}
          >
            Créer un compte
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
