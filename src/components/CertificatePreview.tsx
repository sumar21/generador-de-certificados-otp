import React, { useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { Download } from 'lucide-react';
import './CertificatePreview.css';
import type { Modalidad } from '../app/page';
import { CATEGORIES } from '../app/page';

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
        // 1. Validar nombre
        if (!playerName.trim()) {
            alert('Por favor, ingresa el nombre del jugador.');
            return;
        }

        // 2. Validar categoría
        if (!categoria) {
            alert('Por favor, selecciona una categoría.');
            return;
        }

        // 3. Validar que la categoría sea válida para la modalidad
        const validCategories = CATEGORIES[modalidad];
        if (!validCategories.includes(categoria)) {
            alert(`La categoría "${categoria}" no es válida para la modalidad ${modalidad}. Por favor, selecciona una categoría correcta.`);
            return;
        }

        const captureNode = document.getElementById('capture-node') as HTMLDivElement;
        if (!captureNode) return;

        setLoading(true);
        try {
            // Asegurar que las fuentes estén cargadas antes de capturar
            await document.fonts.ready;

            // Options for html-to-image on the high-res hidden node
            const options = {
                quality: 0.95,
                pixelRatio: 2, // Mejor calidad para retina displays
                width: 794,
                height: 1123,
                style: {
                    transform: 'none', // Reset transforms
                    borderRadius: '0',
                    margin: '0',
                },
            };

            const dataUrl = await toJpeg(captureNode, options);

            const link = document.createElement('a');
            link.download = `Certificado_OTP_${playerName || 'Jugador'}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error creating certificate image:', err);
            alert('Hubo un error al generar la imagen. Por favor intenta de nuevo.');
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

            {/* Hidden High-Res Clone for Capture */}
            <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                <div
                    id="capture-node"
                    className="certificate-a4"
                    style={{
                        width: '794px',
                        height: '1123px',
                        padding: '60px 40px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div className="cert-frame"></div>
                    <div className="cert-border-corner top-left"></div>
                    <div className="cert-border-corner top-right"></div>
                    <div className="cert-border-corner bottom-left"></div>
                    <div className="cert-border-corner bottom-right"></div>

                    <div className="cert-content">
                        <div className="cert-header" style={{ marginTop: '40px' }}>
                            <img src="/logo.png" alt="OTP Logo" style={{ height: '100px', width: 'auto' }} />
                        </div>
                        <div className="cert-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px', color: 'white', textAlign: 'center' }}>
                                Certificado de Ascenso<br />de Categoría
                            </h1>
                            <div style={{ width: '50%', height: '5px', backgroundColor: '#C9FD2E', borderRadius: '4px', marginBottom: '40px' }}></div>

                            <p style={{ fontSize: '18px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7, marginBottom: '20px', color: 'white' }}>
                                OTORGADO A
                            </p>

                            <div style={{ fontSize: '64px', fontWeight: 800, marginBottom: '40px', color: 'white', textAlign: 'center', lineHeight: 1.1 }}>
                                {playerName || 'Nombre del Jugador'}
                            </div>

                            <p style={{ fontSize: '20px', lineHeight: 1.5, opacity: 0.9, maxWidth: '80%', marginBottom: '40px', color: 'white', textAlign: 'center' }}>
                                Por su excelente desempeño y dedicación deportiva,<br />
                                ha sido oficialmente promovido/a a la categoría
                            </p>

                            <div style={{ backgroundColor: '#C9FD2E', color: '#0B38D6', padding: '40px 60px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', minWidth: '220px' }}>
                                <div style={{ fontSize: '90px', fontWeight: 900, lineHeight: 1 }}>{categoria || '-'}</div>
                                <div style={{ fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', marginTop: '15px', borderTop: '2px solid rgba(11, 56, 214, 0.2)', paddingTop: '10px', width: '100%' }}>
                                    {modalidad.toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div className="cert-footer" style={{ marginTop: '40px', paddingBottom: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '2px solid rgba(255,255,255,0.3)', paddingTop: '15px', width: '400px' }}>
                                <p style={{ fontWeight: 700, fontSize: '24px', color: 'white' }}>{formattedDate}</p>
                                <p style={{ fontSize: '14px', opacity: 0.7, letterSpacing: '0.1em', marginTop: '5px', color: 'white' }}>FECHA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePreview;
