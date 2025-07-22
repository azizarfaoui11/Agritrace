import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const ScanLot: React.FC = () => {
  const [lots, setLots] = useState<any[]>([]);
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Charger tous les lots au démarrage
  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await api.getLots(); // Assure-toi que ça retourne une liste de lots
        setLots(res);
      } catch (err) {
        setError("Erreur lors du chargement des lots.");
      }
    };
    fetchLots();
  }, []);

  // Lorsqu’un lot est cliqué
  const handleLotClick = async (lotId: string) => {
    try {
      const res = await api.getLotById(lotId); // Doit retourner { lot, qrCodeImage }
      setSelectedLot(res.lot);
      setQrCodeImage(res.qrCodeImage);
      setError('');
    } catch (err) {
      setError("Erreur lors du chargement du lot.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Liste des lots</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Liste des lots en cartes cliquables */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {lots.map((lot) => (
          <div
            key={lot._id}
            onClick={() => handleLotClick(lot._id)}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              width: '200px',
            }}
          >
            <h3>{lot.name}</h3>
            <p>ID: {lot._id}</p>
          </div>
        ))}
      </div>

      {/* Détails du lot sélectionné */}
      {selectedLot && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Détails du lot</h3>
          <p><strong>Nom :</strong> {selectedLot.name}</p>
          <p><strong>Date QR Code :</strong> {new Date(selectedLot.qrCode.generationDate).toLocaleString()}</p>
          {qrCodeImage && (
            <div style={{ marginTop: '1rem' }}>
              <img src={qrCodeImage} alt="QR Code du lot" width={200} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanLot;

