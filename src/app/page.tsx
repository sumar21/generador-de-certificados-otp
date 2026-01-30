"use client";

import { useState } from 'react';
import './page.css';
import Sidebar from '../components/Sidebar';
import CertificatePreview from '../components/CertificatePreview';

export type Modalidad = 'Varones' | 'Damas' | 'Mixtos';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [modalidad, setModalidad] = useState<Modalidad>('Varones');
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
