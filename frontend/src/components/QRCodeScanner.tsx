import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/QRCodeScanner.css';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    // Création et rendu du scanner
    const scanner = new Html5QrcodeScanner('qr-reader', config, false);
    scannerRef.current = scanner;

    scanner.render(
      (decodedText: string) => {
        console.log('QR code détecté:', decodedText);
        onScan(decodedText);
        // Ne pas appeler clear ici — attendre la fin du composant
      },
      (err: string) => {
        // Pas d'action particulière, juste éviter le spam
        console.warn('Scan erreur:', err);
      }
    );

    // Nettoyage au démontage uniquement
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) =>
          console.error('Erreur lors de la fermeture du scanner:', err)
        );
      }
    };
  }, [onScan]);

  return (
    <div className="qr-scanner">
      <div id="qr-reader" className="qr-reader" />
    </div>
  );
};

export default QRCodeScanner;
