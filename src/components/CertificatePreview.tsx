import React, { useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { Download } from 'lucide-react';
import './CertificatePreview.css';
import type { Modalidad } from '../app/page';

// The logo is served from the public/ folder directly as /logo.png

interface CertificatePreviewProps {
    playerName: string;
    modalidad: Modalidad;
    categoria: string;
    fecha: Date;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
    playerName,
    modalidad,
    categoria,
    fecha,
}) => {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (certificateRef.current === null) return;

        setLoading(true);
        try {
            // Options for html-to-image
            const options = {
                quality: 1,
                pixelRatio: 2, // Double quality for sharp text
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                },
            };

            const dataUrl = await toJpeg(certificateRef.current, options);

            const link = document.createElement('a');
            link.download = `Certificado_OTP_${playerName || 'Jugador'}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error creating certificate image:', err);
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = new Intl.DateTimeFormat('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(fecha);

    return (
        <div className="preview-container">
            <div className="preview-header">
                <h2 className="preview-title">Vista Previa</h2>
                <button
                    className="download-btn"
                    onClick={handleDownload}
                    disabled={loading}
                >
                    <Download size={18} />
                    {loading ? 'Generando...' : 'Descargar JPG'}
                </button>
            </div>

            <div className="certificate-wrapper">
                <div className="certificate-a4" ref={certificateRef}>
                    {/* Decorative Background Elements */}
                    <div className="cert-border-corner top-left"></div>
                    <div className="cert-border-corner top-right"></div>
                    <div className="cert-border-corner bottom-left"></div>
                    <div className="cert-border-corner bottom-right"></div>

                    <div className="cert-content">
                        {/* Header */}
                        <div className="cert-header">
                            <img src="/logo.png" alt="OTP Logo" className="cert-logo" />
                        </div>

                        <div className="cert-body">
                            <h1 className="cert-title">Certificado de Ascenso<br />de Categoría</h1>

                            <div className="cert-separator"></div>

                            <p className="cert-subtitle">OTORGADO A</p>

                            <div className="cert-player-name">
                                {playerName || 'Nombre del Jugador'}
                            </div>

                            <p className="cert-description">
                                Por su excelente desempeño y dedicación deportiva,<br />
                                ha sido oficialmente promovido/a a la categoría
                            </p>

                            <div className="cert-badge">
                                <div className="cert-category">{categoria || '-'}</div>
                                <div className="cert-modality">{modalidad.toUpperCase()}</div>
                            </div>
                        </div>

                        <div className="cert-footer">
                            <div className="cert-date">
                                <p className="date-value">{formattedDate}</p>
                                <p className="date-label">FECHA</p>
                            </div>
                        </div>
                    </div>

                    {/* Blue Frame / Border */}
                    <div className="cert-frame"></div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePreview;
