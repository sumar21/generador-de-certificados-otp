import React from 'react';
import './Sidebar.css';
import type { Modalidad } from '../app/page';
import { CATEGORIES } from '../app/page';

interface SidebarProps {
    playerName: string;
    setPlayerName: (value: string) => void;
    modalidad: Modalidad;
    setModalidad: (value: Modalidad) => void;
    categoria: string;
    setCategoria: (value: string) => void;
    fecha: Date;
    setFecha: (value: Date) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    playerName,
    setPlayerName,
    modalidad,
    setModalidad,
    categoria,
    setCategoria,
    fecha,
    setFecha,
}) => {
    const handleModalidadChange = (newModalidad: Modalidad) => {
        setModalidad(newModalidad);
        setCategoria(''); // Reset category when modality changes
    };

    const currentCategories = CATEGORIES[modalidad];

    // Helper to format date "YYYY-MM-DD" for input
    const dateValue = fecha.toISOString().split('T')[0];

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // When clearing native date picker, e.target.value can be empty
        if (e.target.value) {
            setFecha(new Date(e.target.value));
        }
    };

    return (
        <div className="sidebar-container">
            <h2 className="sidebar-title">Configuración</h2>

            {/* 1. Player Name */}
            <div className="form-group">
                <label className="form-label" htmlFor="player-name">
                    Jugador
                </label>
                <input
                    id="player-name"
                    type="text"
                    className="form-input"
                    placeholder="Nombre del jugador"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
            </div>

            {/* 2. Modalidad Selector */}
            <div className="form-group">
                <label className="form-label">Modalidad</label>
                <div className="segmented-control">
                    {(['Caballeros', 'Damas', 'Mixtos'] as Modalidad[]).map((option) => (
                        <button
                            key={option}
                            className={`segment-button ${modalidad === option ? 'active' : ''}`}
                            onClick={() => handleModalidadChange(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Categoría Selector */}
            <div className="form-group">
                <label className="form-label">Categoría de ascenso</label>
                <div className="categories-grid">
                    {currentCategories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-chip ${categoria === cat ? 'active' : ''}`}
                            onClick={() => setCategoria(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Fecha */}
            <div className="form-group">
                <label className="form-label" htmlFor="date">
                    Fecha
                </label>
                <input
                    id="date"
                    type="date"
                    className="form-input"
                    value={dateValue}
                    onChange={handleDateChange}
                />
            </div>
        </div>
    );
};

export default Sidebar;
