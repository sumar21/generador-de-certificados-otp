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
        const captureNode = document.getElementById('capture-node') as HTMLDivElement;
        if (!captureNode) return;

        setLoading(true);
        try {
            // Options for html-to-image on the high-res hidden node
            const options = {
                quality: 1,
                pixelRatio: 1, // Already set to 794x1123, ratio 1 is enough
            };

            const dataUrl = await toJpeg(captureNode, options);

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
                        <div className="cert-header">
                            <img src="/logo.png" alt="OTP Logo" style={{ height: '80px' }} />
                        </div>
                        <div className="cert-body">
                            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>
                                Certificado de Ascenso<br />de Categoría
                            </h1>
                            <div className="cert-separator" style={{ width: '50%', height: '4px', backgroundColor: '#C9FD2E', marginBottom: '24px' }}></div>
                            <p style={{ fontSize: '16px', opacity: 0.8, letterSpacing: '0.1em', marginBottom: '16px', color: 'white' }}>OTORGADO A</p>
                            <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px', color: 'white' }}>
                                {playerName || 'Nombre del Jugador'}
                            </div>
                            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '32px', color: 'white' }}>
                                Por su excelente desempeño y dedicación deportiva,<br />
                                ha sido oficialmente promovido/a a la categoría
                            </p>
                            <div style={{ backgroundColor: '#C9FD2E', color: '#0B38D6', padding: '32px 48px', borderRadius: '24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1 }}>{categoria || '-'}</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '12px', borderTop: '2px solid rgba(11, 56, 214, 0.2)', paddingTop: '8px' }}>
                                    {modalidad.toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div className="cert-footer" style={{ marginTop: '32px' }}>
                            <div className="cert-date" style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '12px', width: '300px' }}>
                                <p style={{ fontWeight: 600, fontSize: '18px', color: 'white' }}>{formattedDate}</p>
                                <p style={{ fontSize: '12px', opacity: 0.7, color: 'white' }}>FECHA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePreview;
