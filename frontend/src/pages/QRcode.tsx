import React, { useState } from 'react';
import QRCodeScanner from '../components/QRCodeScanner';
import axios from 'axios';

const LotScanPage: React.FC = () => {
  const [lot, setLot] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async (hash: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/lot/hash/${hash}`);
      setLot(res.data.lot);
      setError('');
    } catch (err) {
      setError("⚠️ Lot non trouvé ou QR Code invalide.");
      setLot(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📷 Scanner un QR Code</h2>
      <QRCodeScanner onScan={handleScan} />

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {lot && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '1rem', borderRadius: '10px' }}>
          <h3>✅ Lot trouvé :</h3>
          <p><strong>Nom :</strong> {lot.name}</p>
          <p><strong>ID :</strong> {lot._id}</p>
          <p><strong>Date :</strong> {new Date(lot.createdAt).toLocaleString()}</p>
          {/* Affiche d'autres données ici si ton modèle Lot contient plus d'infos */}
        </div>
      )}
    </div>
  );
};

export default LotScanPage;
