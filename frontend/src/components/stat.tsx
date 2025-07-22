import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

interface Stats {
  totalLots: number;
  totalParcels: number;
  totalFarmers: number;
  totalConsumers: number;
  totalAdmins: number;
  totalOrders: number;
  totalProducts: number;
  totalFeedbacks: number;
  totalReclamations: number;
  totalCultures: number;
  totalStocks: number;
}

interface MonthlyStat {
  month: string;
  lots?: number;
  parcels?: number;
  farmers?: number;
  orders?: number;
  products?: number;
  feedbacks?: number;
  reclamations?: number;
  cultures?: number;
}

const cardStyles: { [key: string]: string } = {
  totalLots: 'from-purple-500 to-purple-700',
  totalParcels: 'from-indigo-500 to-indigo-700',
  totalFarmers: 'from-green-500 to-green-700',
  totalConsumers: 'from-blue-500 to-blue-700',
  totalAdmins: 'from-pink-500 to-pink-700',
  totalOrders: 'from-yellow-500 to-yellow-700',
  totalProducts: 'from-red-500 to-red-700',
  totalFeedbacks: 'from-emerald-500 to-emerald-700',
  totalReclamations: 'from-rose-500 to-rose-700',
  totalCultures: 'from-cyan-500 to-cyan-700',
  totalStocks: 'from-orange-500 to-orange-700',
};

const formatLabel = (key: string) =>
  key.replace('total', '').replace(/([A-Z])/g, ' $1').trim();

const AdminStats: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [stats, setStats] = useState<Stats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Reload automatique une seule fois juste après login
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role && !sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
  }, []);

  // Vérification utilisateur
  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'Admin') {
        navigate('/');
        return;
      }
      setUser(parsedUser);
    } catch {
      navigate('/login');
    } finally {
      setLoadingUser(false);
    }
  }, [navigate]);

  // Chargement des statistiques si user est défini
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {

        const res = await axios.get('http://localhost:5000/api/admin/stat');
        setStats(res.data);
        
      } catch (error) {
        console.error('Erreur récupération stats générales', error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchMonthlyStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/lots-per-month');
        setMonthlyStats(res.data.stats);
      } catch (error) {
        console.error('Erreur récupération stats mensuelles', error);
      }
    };

    fetchStats();
    fetchMonthlyStats();
  }, [user]);

  if (loadingUser) {
    return <div className="text-center mt-10 text-lg text-gray-700">Chargement de l'utilisateur...</div>;
  }

  if (!user) {
    return null; // redirection déjà gérée
  }

  if (loadingStats || !stats) {
    return <div className="text-center mt-10 text-lg text-gray-700">Chargement des statistiques...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Tableau de bord administratif</h2>

      {/* Cartes statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className={`rounded-2xl p-5 shadow-md text-white bg-gradient-to-r ${cardStyles[key] || 'from-gray-500 to-gray-700'}`}
          >
            <h3 className="text-sm uppercase tracking-wide font-medium">
              {formatLabel(key)}
            </h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Graphique d'évolution mensuelle */}
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Évolution Mensuelle</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyStats}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {[
              'stocks', 'parcels', 'farmers', 'orders',
              'products', 'feedbacks', 'reclamations', 'cultures'
            ].map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#0088FE', '#d62d20', '#a020f0'][index]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminStats;
