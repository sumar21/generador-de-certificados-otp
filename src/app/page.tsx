"use client";

import { useState } from 'react';
import './page.css';
import Sidebar from '../components/Sidebar';
import CertificatePreview from '../components/CertificatePreview';

export type Modalidad = 'Caballeros' | 'Damas' | 'Mixtos';

export const CATEGORIES: Record<Modalidad, string[]> = {
  Caballeros: ['C3/C4', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
  Damas: ['D4/D5', 'D6', 'D7/D8', 'D8'],
  Mixtos: [
    'Suma 9',
    'Suma 10',
    'Suma 11',
    'Suma 12',
    'Suma 13',
    'Suma 14',
    'Suma 15',
    'Suma 16',
  ],
};

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [modalidad, setModalidad] = useState<Modalidad>('Caballeros');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState<Date>(new Date());

  return (
    <div className="app-container">
      <div className="layout-split">
        <div className="panel link-panel">
          <Sidebar
            playerName={playerName}
            setPlayerName={setPlayerName}
            modalidad={modalidad}
            setModalidad={setModalidad}
            categoria={categoria}
            setCategoria={setCategoria}
            fecha={fecha}
            setFecha={setFecha}
          />
        </div>
        <div className="panel right-panel">
          <CertificatePreview
            playerName={playerName}
            modalidad={modalidad}
            categoria={categoria}
            fecha={fecha}
          />
        </div>
      </div>
    </div>
  );
}
