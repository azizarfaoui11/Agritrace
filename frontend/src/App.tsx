import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; // OK ici
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import ScanLot from './components/ScanLot';
import AdminDashboard from './components/Admindash';
import './App.css';
import AgriculteurList from './components/agrilist';
import StockMnagerList from './components/responsablesstocklist';
import TransporterList from './components/transporterlist';
import VendeurList from './components/vendeurslist';
import ConsumerPage from './components/consommateur';
import Home from './components/Home';
//import Dashboard from './components/agri3';
import Agri3 from './components/agri3';
import CreateParcelPage from './components/createparcel';
import MyParcels from './components/myparcels';
import MyVarieties from './components/myvaritys';
import AdminStats from './components/stat';
import FeedbackForm from './components/Feedback';
import ReclamationForm from './components/Reclamation';
import AllProducts from './components/Products';
import OrdersPage from './components/orderlist';
import ZoneList from './components/zonelist';
import ZoneFormModal from './components/ZoneFormModal';
import StockFormModal from './components/StockFormModal';
import StockCardList from './components/Stocklist';
import StockCardList1 from './components/stocklist1';
import StockCardList2 from './components/stocklist2';
import OrdersPageAdmin from './components/orderlistadmin';
import OrdersPageSeller from './components/orderlistseller';
import ReclamationList from './components/reclamationlist';
import FeedbackList from './components/feedbacklist';
import TransformateurList from './components/transformateurlist';
import TransporterOrders from './components/TransporterOrders';
import AdminWelcomePage from './components/admin';
import Transformateur from './components/transformateur';
import Orderstransformateur  from './components/orderlisttransformateur';
import ProductsInOrdersTable from './components/conformite';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation(); // ✅ Correct : à l’intérieur du composant
  const isAgriRoute = location.pathname === '/agri' || location.pathname.startsWith('/consommateur') || location.pathname.startsWith('/home')
  || location.pathname.startsWith('/scan') || location.pathname.startsWith('/suivi')
  || location.pathname.startsWith('/modallot') ||
  location.pathname.startsWith('/agriii') 
  ||location.pathname.startsWith('/mylots')
  || location.pathname.startsWith('/myparcels') 
  ||location.pathname.startsWith('/myvarietys') 
  || location.pathname.startsWith('/feedback') || location.pathname.startsWith('/reclamation') 
  || location.pathname.startsWith('/produit') || location.pathname.startsWith('/orderliststock')|| location.pathname.startsWith('/zonelist')
    || location.pathname.startsWith('/zonemodal')|| location.pathname.startsWith('/stockmodal') || location.pathname.startsWith('/stocklist')
      || location.pathname.startsWith('/stocklist1') || location.pathname.startsWith('/stocklist2')
       || location.pathname.startsWith('/orderlistseller') || location.pathname.startsWith('/login') ||
      location.pathname.startsWith('/ordertransporteur')  || location.pathname.startsWith('/admin') ||  location.pathname.startsWith('/transformateur')
||  location.pathname.startsWith('/orderlisttransformateur')  || location.pathname.startsWith('/conformite')
      ;
   // Tu peux aussi faire : includes('/agri') si nécessaire


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {user && !isAgriRoute && <Sidebar onLogout={handleLogout} />}

      <div className="flex flex-col flex-1 overflow-auto bg-gray-100">
        {user && !isAgriRoute && (
          <Navbar userRole={user.role} userName={user.name} onLogout={handleLogout} />
        )}

        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/" element={ <Navigate to="/home" /> } />
            <Route path="/login" element={<Login/>} />

            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/scan" element={<ScanLot />} />
            <Route path="/tablesadmin" element={<AdminDashboard />} />
            <Route path="/agrilist" element={<AgriculteurList/>}/>
            <Route path="/stockmanagerlist" element={<StockMnagerList/>}/>
            <Route path="/transporterlist" element={<TransporterList/>}/>
            <Route path="/listtransformateur" element={<TransformateurList/>}/>
            <Route path="/vendeurlist" element={<VendeurList/>}/>
            <Route path="/consommateur" element={<ConsumerPage/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/suivi" element={<ConsumerPage />} />
           <Route path="/agriii" element={<Agri3 />} />
           <Route path="/createparcel" element={<CreateParcelPage />} />
           <Route path="/myparcels" element={<MyParcels />} />
           <Route path="/myvarietys" element={<MyVarieties />} />
           <Route path="/stat" element={<AdminStats />} />
          
              <Route path="/produit" element={<AllProducts />} />
              <Route path="/orderliststock" element={<OrdersPage/>}/>
              <Route path="/zonelist" element={<ZoneList/>}/>
              <Route path="/zonemodal" element={<ZoneFormModal/>}/>
              <Route path="/stockmodal" element={<StockFormModal onClose={function (): void {
              throw new Error('Function not implemented.');
            } } onStockAdded={function (): void {
              throw new Error('Function not implemented.');
            } }/>}/>

            <Route path="/stocklist" element={<StockCardList/>}/>
            <Route path="/stocklist1" element={<StockCardList1/>}/>
            <Route path="/stocklist2" element={<StockCardList2/>}/>
            <Route path="/orderlistadmin" element={<OrdersPageAdmin/>}/>
            <Route path="/orderlistseller" element={<OrdersPageSeller/>}/>
            <Route path="/reclamation" element={<ReclamationForm  />}/>
            <Route path="/feedback" element={<FeedbackForm/>}/>
            <Route path="/reclamlist" element={<ReclamationList  />}/>
            <Route path="/fbacklist" element={<FeedbackList  />}/>
            <Route path="/ordertransporteur" element={<TransporterOrders/>}/>
            <Route path="/admin" element={<AdminWelcomePage/>}/>
            <Route path="/transformateur" element={<Transformateur/>}/>
            <Route path="/orderlisttransformateur" element={<Orderstransformateur/>}/>
            <Route path="/conformite" element={<ProductsInOrdersTable/>}/>


            



            








           



            






          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
