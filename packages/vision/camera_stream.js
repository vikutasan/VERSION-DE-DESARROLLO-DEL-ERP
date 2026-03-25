/**
 * Módulo de Cámara para R de Rico: Visión Industrial (UVC)
 * Diseñado para sensores Sony IMX179 (4K/1080p).
 * 
 * Este módulo se encargará de:
 * 1. Conectar con la cámara UVC USB.
 * 2. Procesar el flujo de video a 60fps.
 * 3. Enviar frames al modelo de IA para detección de pan (conchas, bolillos, etc.)
 */

export class CameraService {
    constructor(deviceId = 0) {
        this.deviceId = deviceId;
        this.stream = null;
    }

    async getDevices() {
        return navigator.mediaDevices.enumerateDevices();
    }

    async startCamera() {
        try {
            // Configuración optimizada para detección de texturas finas (R de Rico)
            const constraints = {
                video: {
                    deviceId: this.deviceId ? { exact: this.deviceId } : undefined,
                    width: { ideal: 3840, max: 4096 }, // 4K Ready
                    height: { ideal: 2160, max: 2160 },
                    frameRate: { ideal: 60 } // Fluidez extrema para conteo rápido
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log("Cámara industrial R de Rico iniciada correctamente.");
            return this.stream;
        } catch (error) {
            console.error("Error al iniciar la cámara industrial:", error);
            throw error;
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            console.log("Cámara detenida.");
        }
    }
}
