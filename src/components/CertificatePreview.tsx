import React, { useEffect, useRef, useState } from 'react';
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
    const [logoBase64, setLogoBase64] = useState<string | null>(null);
    const [logoMobileBase64, setLogoMobileBase64] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    // Convert logos to base64 to ensure they appear in the downloaded image
    useEffect(() => {
        const convertLogo = async (url: string, setter: (val: string) => void) => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setter(reader.result as string);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error(`Error loading logo from ${url}:`, error);
            }
        };

        convertLogo('/logo.svg', setLogoBase64);
        // convertLogo('/logo-mobile.png', setLogoMobileBase64); // Deprecated in favor of SVG
    }, []);

    const actionVerb = modalidad === 'Damas' ? 'ascendida' : 'ascendido';

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
        const captureContainer = document.getElementById('capture-container') as HTMLDivElement;

        if (!captureNode || !captureContainer) return;

        setLoading(true);
        // Force the capture node to be visible on top of everything to ensure rendering
        setIsCapturing(true);

        try {
            // Asegurar que las fuentes estén cargadas antes de capturar
            await document.fonts.ready;

            // Wait a bit for the layout to stabilize and Safari to paint the visible node
            await new Promise(resolve => setTimeout(resolve, 800));

            // Wait a bit for the layout to stabilize and Safari to paint the visible node
            await new Promise(resolve => setTimeout(resolve, 800));

            // Force image decoding explicitly for all images in the capture node
            const images = Array.from(captureNode.getElementsByTagName('img'));
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));
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
                cacheBust: true,
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
            setIsCapturing(false);
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
                        <div
                            className="cert-header"
                            style={{
                                width: '100%',
                                height: '55px', // Altura fija para preview
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{
                                width: '220px',
                                height: '100%',
                                backgroundImage: `url(${logoBase64 || "/logo.png"})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                filter: 'brightness(0) invert(1)' // Mantener blanco en preview
                            }}></div>
                        </div>

                        <div className="cert-body">
                            <h1 className="cert-title">Certificado de Ascenso<br />de Categoría</h1>

                            <div className="cert-separator"></div>

                            <p className="cert-subtitle">OTORGADO A</p>

                            <div className="cert-player-name">
                                {playerName || 'Nombre del Jugador'}
                            </div>

                            <p className="cert-description">
                                En virtud del nivel de juego observado y evaluado de acuerdo a nuestros criterios,<br />
                                ha sido oficialmente {actionVerb} a la categoría
                            </p>

                            <div className="cert-badge">
                                <div className="cert-category">{categoria || '-'}</div>
                                <div className="cert-modality">{modalidad.toUpperCase()}</div>
                            </div>

                            <p className="cert-small-print">
                                La participación en una categoría inferior sin consulta previa a la organización podrá derivar en descalificación del torneo y/o anulación de premios en caso de detectarse con posterioridad. La nueva categoría aplica también para la suma en torneos mixtos.
                            </p>
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

            {/* 
                Hidden High-Res Clone for Capture 
                We use 'isCapturing' state to toggle visibility. 
                When capturing, it covers the screen (z-index 9999) to force rendering, 
                otherwise it's hidden but kept in DOM.
            */}
            {/* 
                Hidden High-Res Clone for Capture 
                We use 'isCapturing' state to toggle visibility. 
                When capturing, it covers the screen (z-index 9999) to force rendering, 
                otherwise it's hidden but kept in DOM.
            */}
            <div
                id="capture-container"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    // FORZAR DIMENSIONES A4 COMPLETAS para evitar que mobile re-calcule el layout
                    width: '794px',
                    height: '1123px',
                    overflow: 'visible',
                    zIndex: isCapturing ? 9999 : -50,
                    opacity: isCapturing ? 1 : 0,
                    pointerEvents: 'none',
                    // Fondo neutro por si acaso
                    backgroundColor: 'transparent',
                }}
            >
                <div
                    id="capture-node"
                    className="certificate-a4"
                    style={{
                        width: '794px',
                        minWidth: '794px',
                        height: '1123px',
                        minHeight: '1123px',
                        padding: '70px 60px',
                        display: 'flex',
                        flexDirection: 'column',
                        transform: 'none',
                        backgroundColor: '#0B38D6', // Azul OTP
                        margin: 0,
                        position: 'relative', // Relative al container
                    }}
                >
                    <div className="cert-frame"></div>
                    <div className="cert-border-corner top-left"></div>
                    <div className="cert-border-corner top-right"></div>
                    <div className="cert-border-corner bottom-left"></div>
                    <div className="cert-border-corner bottom-right"></div>

                    <div className="cert-content">
                        {/* 
                            USAMOS IMG NORMAL CON FILTER PARAasegurar contraste (blanco sobre azul)
                        */}
                        <div
                            className="cert-header"
                            style={{
                                marginTop: '10px',
                                width: '100%',
                                height: 'auto',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}
                        >
                            <img
                                src={logoBase64 || "/logo.svg"}
                                alt="OTP Logo"
                                style={{
                                    width: 'auto',
                                    height: '140px', // Altura aumentada para mayor visibilidad
                                    display: 'block',
                                    maxWidth: '400px',
                                    filter: 'brightness(0) invert(1)', // SVG forzado a BLANCO
                                }}
                            />
                        </div>

                        <div className="cert-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <h1 style={{ fontSize: '34px', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px', color: 'white', textAlign: 'center' }}>
                                Certificado de Ascenso<br />de Categoría
                            </h1>
                            <div style={{ width: '40%', height: '4px', backgroundColor: '#C9FD2E', borderRadius: '4px', marginBottom: '30px' }}></div>

                            <p style={{ fontSize: '15px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7, marginBottom: '15px', color: 'white' }}>
                                OTORGADO A
                            </p>

                            <div style={{ fontSize: '54px', fontWeight: 800, marginBottom: '30px', color: 'white', textAlign: 'center', lineHeight: 1.1 }}>
                                {playerName || 'Nombre del Jugador'}
                            </div>

                            <p style={{ fontSize: '18px', lineHeight: 1.5, opacity: 0.9, maxWidth: '80%', marginBottom: '30px', color: 'white', textAlign: 'center' }}>
                                En virtud del nivel de juego observado y evaluado de acuerdo a nuestros criterios,<br />
                                ha sido oficialmente {actionVerb} a la categoría
                            </p>

                            <div style={{
                                backgroundColor: '#C9FD2E',
                                color: '#0B38D6',
                                padding: '25px 60px',
                                borderRadius: '28px',
                                textAlign: 'center',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                                minWidth: '220px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ fontSize: '80px', fontWeight: 900, lineHeight: 1 }}>{categoria || '-'}</div>
                                <div style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', marginTop: '8px', borderTop: '2px solid rgba(11, 56, 214, 0.2)', paddingTop: '8px', width: '100%' }}>
                                    {modalidad.toUpperCase()}
                                </div>
                            </div>

                            <p style={{ fontSize: '12px', lineHeight: 1.4, opacity: 0.6, maxWidth: '85%', marginTop: '35px', color: 'white', textAlign: 'center' }}>
                                La participación en una categoría inferior sin consulta previa a la organización podrá derivar en descalificación del torneo y/o anulación de premios en caso de detectarse con posterioridad. La nueva categoría aplica también para la suma en torneos mixtos.
                            </p>
                        </div>
                        <div className="cert-footer" style={{ marginTop: '20px', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '2px solid rgba(255,255,255,0.3)', paddingTop: '10px', width: '350px' }}>
                                <p style={{ fontWeight: 700, fontSize: '20px', color: 'white' }}>{formattedDate}</p>
                                <p style={{ fontSize: '11px', opacity: 0.7, letterSpacing: '0.1em', marginTop: '4px', color: 'white' }}>FECHA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePreview;
