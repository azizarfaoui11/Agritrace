import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import * as FaIcons from 'react-icons/fa';
import { Role } from '../services/api'; // Assurez-vous que le type 'Role' est bien importé


const FaUser = FaIcons.FaUser as React.FC<React.SVGProps<SVGSVGElement>>;
const FaEnvelope = FaIcons.FaEnvelope as React.FC<React.SVGProps<SVGSVGElement>>;
const FaLock = FaIcons.FaLock as React.FC<React.SVGProps<SVGSVGElement>>;
const FaSeedling = FaIcons.FaSeedling as React.FC<React.SVGProps<SVGSVGElement>>;
const FaWallet = FaIcons.FaWallet as React.FC<React.SVGProps<SVGSVGElement>>;
const FaUserTag = FaIcons.FaUserTag as React.FC<React.SVGProps<SVGSVGElement>>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  type FormData = {
    nom: string;
    email: string;
    password: string;
    confirmPassword: string;
    telephone: string;
    role: Role
  };
  
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    role: Role.FARMER
  });
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { label: 'Agriculteur', value: 'Farmer' },
    { label: 'Transporteur', value: 'Transporter' },
    { label: 'Responsable Stockage', value: 'StockManager' },
    { label: 'Vendeur', value: 'Seller' },
    { label: 'Transformateur', value: 'Transformateur' },

  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    try {
      const { nom, email, password, role, telephone } = formData;
      await api.register({ nom, email, password, role, telephone });
      setSuccessMessage('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border-t-4 border-green-600">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-green-800">
          <FaSeedling className="text-3xl" /> Créer un compte Agriculteur
        </h2>

        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
        {successMessage && <div className="mb-4 text-green-600 font-medium">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>
       


          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Numero de tel</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaWallet className="text-gray-500 mr-2" />
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaUserTag className="text-gray-500 mr-2" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 bg-white text-gray-700 border-none rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
  type="submit"
  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
  disabled={isLoading}
>
  {isLoading ? 'Inscription...' : "S'inscrire"}
</button>

<button
  type="button"
  onClick={() => navigate('/login')}
  className="w-full mt-3 text-green-800 font-medium hover:underline"
>
  Retour à la connexion
</button>


          
        </form>
      </div>
    </div>
  );
};

export default Register;
