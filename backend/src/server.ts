import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes';
import lotRoutes from './routes/lotRoutes';
import parcelRoutes from './routes/parcelRoutes';
import EnvironmentRoutes from './routes/EnvironmentRoutes';
import StorageConditionRoutes from './routes/StorageConditionRoutes';
import TransportConditionRoutes from './routes/TransportConditionRoutes';
import VarietyRoutes from './routes/VarietyRoutes';
import path from 'path';
import orderRoutes from './routes/orderRoutes';
import cultureRoutes from './routes/cultureRoutes';
import stockRoutes from './routes/stockRoutes';
import produitRoutes from './routes/produitRoutes';
import expeditionRoutes from './routes/expeditionRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import traitementRoutes from './routes/traitementRoutes';
import reclamationRoutes from './routes/reclamationRoutes';
import ZoneRoutes from './routes/ZoneRoutes';
import chatRoutes from './routes/chatRoutes';


// Configuration des variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const MONGODB_URI = 'mongodb+srv://arfaouimohamedaziz5:M8GA0bf7AST5oo3Z@cluster0.rbfqvzx.mongodb.net/';

const PORT = parseInt(process.env.PORT || "5000", 10);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB Atlas');
    // Démarrer le serveur uniquement après la connexion à MongoDB
    app.listen(PORT, '0.0.0.0',() => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1); // Arrêter le serveur si la connexion échoue
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user' , userRoutes);
app.use('/api/admin' , adminRoutes);
app.use('/api/lot' , lotRoutes);
app.use('/api/parcel' , parcelRoutes);
app.use('/api/environment', EnvironmentRoutes);
app.use('/api/storage-conditions', StorageConditionRoutes);
app.use('/api/transport-conditions', TransportConditionRoutes);
app.use('/api/varieties', VarietyRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/order', orderRoutes);
app.use("/api/cultures", cultureRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/produits", produitRoutes);
app.use("/api/expeditions", expeditionRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/reclamations", reclamationRoutes);
app.use("/api/traitements", traitementRoutes);
app.use("/api/zones", ZoneRoutes);
app.use("/api/chat",chatRoutes);






