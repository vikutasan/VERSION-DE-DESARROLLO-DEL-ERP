import { useState, useEffect } from 'react';
import { posService } from '../services/POSService';

/**
 * Custom Hook: useTerminalLocking
 * Encapsula toda la lógica de ocupación de terminales:
 * - Polling de estados de terminales (cada 3s en pantalla de selección)
 * - Auto-expulsión si un Admin rompe nuestro bloqueo (cada 10s)
 * - Limpieza automática al desmontar (liberar terminal)
 */
export const useTerminalLocking = (selectedTerminal, currentUser) => {
    const [terminalStatuses, setTerminalStatuses] = useState({});
    const [forceLogoutModal, setForceLogoutModal] = useState(false);

    const [settings, setSettings] = useState({
        statusPolling: 3000,
        checkLockPolling: 10000,
        heartbeatInterval: 60000
    });

    // Cargar ajustes del sistema al montar
    useEffect(() => {
        posService.getSystemSettings()
            .then(data => {
                const s = {};
                data.forEach(item => {
                    if (item.key === 'pos_terminal_status_polling_ms') s.statusPolling = parseInt(item.value);
                    if (item.key === 'pos_heartbeat_interval_ms') s.heartbeatInterval = parseInt(item.value);
                });
                if (Object.keys(s).length > 0) {
                    setSettings(prev => ({ ...prev, ...s }));
                }
            })
            .catch(e => console.warn("Usando intervalos por defecto", e));
    }, []);

    // Polling en pantalla principal para ver quién ocupa las terminales
    useEffect(() => {
        let interval;
        const fetchStatuses = async () => {
            if (!selectedTerminal) {
                try {
                    const data = await posService.getTerminalsStatus();
                    setTerminalStatuses(data);
                } catch (e) {
                    console.error("Error fetching terminal status", e);
                }
            }
        };
        fetchStatuses();
        interval = setInterval(fetchStatuses, settings.statusPolling);
        return () => clearInterval(interval);
    }, [selectedTerminal, settings.statusPolling]);

    // Polling de Auto-Expulsión: verifica si un Admin rompió nuestro bloqueo
    useEffect(() => {
        if (!selectedTerminal || forceLogoutModal) return;
        
        const checkMyLock = async () => {
            try {
                const data = await posService.getTerminalsStatus();
                const myStatus = data[selectedTerminal];
                if (!myStatus || myStatus.occupier_id !== currentUser?.id) {
                    setForceLogoutModal(true);
                }
            } catch (e) {
                console.error("Polling lock error", e);
            }
        };
        
        const intervalId = setInterval(checkMyLock, settings.checkLockPolling);
        return () => clearInterval(intervalId);
    }, [selectedTerminal, currentUser, forceLogoutModal, settings.checkLockPolling]);

    // Limpieza al desmontar: liberar terminal si el usuario cierra sesión o cierra la pestaña
    useEffect(() => {
        return () => {
            if (selectedTerminal && currentUser?.id) {
                posService.unlockTerminal(selectedTerminal, currentUser.id).catch(e => console.warn("Auto-unlock en limpieza falló", e));
            }
        };
    }, [selectedTerminal, currentUser]);

    // Heartbeat: renueva el timestamp del candado para evitar que expire por TTL
    useEffect(() => {
        if (!selectedTerminal || !currentUser?.id) return;
        
        const sendHeartbeat = () => {
            posService.heartbeatTerminal(selectedTerminal, currentUser.id)
                .catch(e => console.warn("Heartbeat failed", e));
        };

        // Enviar heartbeat inmediatamente al seleccionar terminal
        sendHeartbeat();
        const intervalId = setInterval(sendHeartbeat, settings.heartbeatInterval); 
        return () => clearInterval(intervalId);
    }, [selectedTerminal, currentUser, settings.heartbeatInterval]);

    return { terminalStatuses, setTerminalStatuses, forceLogoutModal, setForceLogoutModal };
};
