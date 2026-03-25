import { useState } from 'react';

export const useVision = () => {
    const [isScanning, setIsScanning] = useState(false);

    const startScanning = () => setIsScanning(true);
    const stopScanning = () => setIsScanning(false);

    return {
        isScanning,
        setIsScanning,
        startScanning,
        stopScanning
    };
};
