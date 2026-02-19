import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import './CongratulationMessage.css';
import type { Modalidad } from '../app/page';

interface CongratulationMessageProps {
    playerName: string;
    modalidad: Modalidad;
    categoria: string;
}

/**
 * Devuelve la categoría máxima según la modalidad.
 * Caballeros → C3
 * Damas → D4
 * Mixtos → Suma 7
 */
function getCategoriaMaxima(modalidad: Modalidad): string {
    switch (modalidad) {
        case 'Caballeros':
            return 'C3';
        case 'Damas':
            return 'D4';
        case 'Mixtos':
            return 'Suma 7';
    }
}

const CongratulationMessage: React.FC<CongratulationMessageProps> = ({
    playerName,
    modalidad,
    categoria,
}) => {
    const [copied, setCopied] = useState(false);

    const esCategoriaMaxima = categoria === getCategoriaMaxima(modalidad);

    const mensaje = useMemo(() => {
        const nombre = playerName.trim() || 'Jugador';

        if (esCategoriaMaxima) {
            return `🏆 Felicitaciones ${nombre} por alcanzar la categoría máxima ${categoria} (${modalidad}).\nEste logro refleja tu nivel, constancia y competitividad.\nAhora toca defender lo conseguido.`;
        }

        return `🎉 Felicitaciones ${nombre} por tu ascenso a ${categoria || '—'} (${modalidad}).\nTu desempeño y compromiso hicieron que este logro sea totalmente merecido.\n¡Nos vemos en la próxima categoría!`;
    }, [playerName, modalidad, categoria, esCategoriaMaxima]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(mensaje);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback para navegadores sin Clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = mensaje;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="congratulation-card">
            <h3 className="congratulation-title">Mensaje de felicitación</h3>

            <textarea
                className="congratulation-textarea"
                readOnly
                value={mensaje}
                tabIndex={-1}
            />

            <button
                className={`congratulation-copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                type="button"
            >
                {copied ? (
                    <>
                        <Check size={16} />
                        Mensaje copiado ✓
                    </>
                ) : (
                    <>
                        <Copy size={16} />
                        Copiar mensaje
                    </>
                )}
            </button>
        </div>
    );
};

export default CongratulationMessage;
