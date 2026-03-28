import React, { useRef, useEffect, useState, useMemo } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { posService } from './services/POSService';

/**
 * VisionScanner - R de Rico
 * 
 * Componente que gestiona el flujo de cámara real y el análisis
 * híbrido: Servidor Local (T6) -> Nube (Gemini).
 */
export const VisionScanner = ({ onScan, isScanning, onCaptureFrame, products = [], categories = [], onStatusChange }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasError, setHasError] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [lastAnalysis, setLastAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(localStorage.getItem('preferredCameraId') || '');

    // Configuración de Gemini (Respaldo)
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Agrupar productos por categoría para el prompt de Gemini
    const catalogSummary = useMemo(() => {
        const groups = {};
        const activeCategoryNames = categories.filter(c => c.visionEnabled).map(c => c.name);
        
        products.forEach(p => {
            if (activeCategoryNames.includes(p.category)) {
                if (!groups[p.category]) groups[p.category] = [];
                groups[p.category].push(p.name);
            }
        });
        return groups;
    }, [products, categories]);

    // Enumerar cámaras disponibles
    useEffect(() => {
        const getDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
                setDevices(videoDevices);
                if (!selectedDeviceId && videoDevices.length > 0) {
                    setSelectedDeviceId(videoDevices[0].deviceId);
                }
            } catch (err) {
                console.error("Error enumerando dispositivos:", err);
            }
        };
        getDevices();
    }, []);

    // Inicializar Cámara
    useEffect(() => {
        let stream = null;
        const startCamera = async () => {
            setHasError(false);
            setErrorMsg('');
            const constraints = selectedDeviceId 
                ? { video: { deviceId: { exact: selectedDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } }
                : { video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } };

            try {
                stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    localStorage.setItem('preferredCameraId', selectedDeviceId);
                }
            } catch (err) {
                setErrorMsg('No se pudo conectar con esta cámara');
                setHasError(true);
            }
        };

        if (!isSimulating) startCamera();
        return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, [isSimulating, selectedDeviceId]);

    // Loop de Captura/Análisis
    useEffect(() => {
        let interval;
        if (onCaptureFrame && !isSimulating && !hasError) {
            interval = setInterval(() => {
                if (videoRef.current && canvasRef.current) {
                    const context = canvasRef.current.getContext('2d');
                    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
                    onCaptureFrame(imageData);
                }
            }, 500);
        } else if (isScanning && !isSimulating && !hasError) {
            interval = setInterval(analyzeFrame, 3000);
        }
        return () => clearInterval(interval);
    }, [isScanning, onCaptureFrame, isSimulating, hasError]);

    // --- Lógica de Análisis Híbrido ---
    const analyzeFrame = async () => {
        if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
        setIsAnalyzing(true);
        onStatusChange?.('ANALYZING');

        try {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
            const base64Data = imageData.split(',')[1];

            // 1. INTENTO LOCAL (OpenCV en T6)
            try {
                const localRes = await posService.predictVision(imageData, localStorage.getItem('terminalId') || 'T1');
                if (localRes.detections?.length > 0 && localRes.detections[0].confidence > 0.6) {
                    setLastAnalysis(localRes.detections);
                    onStatusChange?.('LOCAL');
                    localRes.detections.forEach(det => {
                        onScan({ name: det.label, quantity: det.qty, isAI: true });
                    });
                    return; 
                }
            } catch (localErr) {
                console.warn("IA Local no disponible, usando Nube...");
            }

            // 2. RESPALDO EN NUBE (Gemini)
            const catalogJson = JSON.stringify(catalogSummary);
            const prompt = `Bakery POS Expert. Catalog: ${catalogJson}. Return JSON array [{"label": "EXACT_NAME", "qty": N}].`;

            const result = await model.generateContent([
                prompt,
                { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
            ]);

            const detections = JSON.parse((await result.response).text().replace(/```json|```/g, "").trim());
            setLastAnalysis(detections);
            onStatusChange?.('CLOUD');
            if (Array.isArray(detections)) {
                detections.forEach(det => onScan({ name: det.label, quantity: det.qty, isAI: true }));
            }
        } catch (error) {
            console.error("Vision Error:", error);
            onStatusChange?.('ERROR');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Dibujar overlays visuales
    useEffect(() => {
        if ((isScanning || isSimulating) && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const animate = () => {
                if (!isScanning && !isSimulating) return;
                
                if (isSimulating) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.strokeStyle = '#c1d72e'; ctx.lineWidth = 2;
                    ctx.strokeRect(200, 200, 150, 150);
                    ctx.fillStyle = '#c1d72e'; ctx.font = 'bold 12px Inter';
                    ctx.fillText(`MOCK PRODUCT x1`, 200, 190);
                } else if (lastAnalysis) {
                    ctx.clearRect(0, 0, canvasRef.current.width, 100);
                    ctx.fillStyle = '#c1d72e'; ctx.font = 'bold 20px Inter';
                    lastAnalysis.forEach((det, i) => {
                        ctx.fillText(`DETECTADO: ${det.label} x${det.qty}`, 50, 50 + (i * 30));
                    });
                }
                requestAnimationFrame(animate);
            };
            animate();
        }
    }, [isScanning, isSimulating, lastAnalysis]);

    return (
        <div className="relative w-full h-full bg-black rounded-[60px] overflow-hidden border-2 border-white/5 shadow-2xl group">
            {hasError && !isSimulating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-10 text-center z-50 bg-black/80 backdrop-blur-md">
                    <span className="text-6xl mb-6">👁️</span>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2 italic">Cámara no Detectada</h2>
                    <p className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-6">{errorMsg || 'Hardware no disponible'}</p>

                    <div className="flex gap-4">
                        <button onClick={() => setIsSimulating(true)} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Ver Simulación</button>
                        <button onClick={() => window.location.reload()} className="bg-[#c1d72e] text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:scale-105">Reintentar</button>
                    </div>
                </div>
            ) : (
                <>
                    {!isSimulating ? (
                        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" />
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden">
                            <div className="flex items-center justify-center h-full"><span className="text-[100px] opacity-10">🥖</span></div>
                        </div>
                    )}

                    <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

                    <div className="absolute top-10 right-10 z-20">
                        {devices.length > 1 && (
                            <select value={selectedDeviceId} onChange={(e) => setSelectedDeviceId(e.target.value)} className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 outline-none focus:border-[#c1d72e]/50 cursor-pointer">
                                {devices.map(device => (
                                    <option key={device.deviceId} value={device.deviceId} className="bg-black text-white">{device.label || `Cámara ${devices.indexOf(device) + 1}`}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="absolute bottom-10 inset-x-0 flex justify-center z-20">
                        <div className="bg-black/60 backdrop-blur-xl px-8 py-4 rounded-[30px] border border-white/5 flex items-center gap-6 shadow-2xl">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Resolución</p>
                                <p className="text-[10px] font-bold text-white/90">{isSimulating ? 'EMULATED' : '1080p @ 60fps'}</p>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="text-left">
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Sensor</p>
                                <p className="text-[10px] font-bold text-[#c1d72e] italic">R-DE-RICO VISION IA</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
