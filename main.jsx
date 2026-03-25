import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExperimentCenterUI } from './apps/ExperimentCenterUI';
import './index.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        this.setState({ info });
        console.error("Error capturado:", error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    background: '#0a0a0a', color: '#fff', height: '100vh',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', fontFamily: 'monospace', padding: '40px'
                }}>
                    <h1 style={{ color: '#f97316', fontSize: '2rem', marginBottom: '20px' }}>
                        ⚠️ Error en el Sistema
                    </h1>
                    <pre style={{
                        background: '#1a1a1a', padding: '20px', borderRadius: '8px',
                        maxWidth: '800px', overflow: 'auto', fontSize: '12px',
                        border: '1px solid #333', color: '#ef4444'
                    }}>
                        {this.state.error && this.state.error.toString()}
                        {'\n\n'}
                        {this.state.info && this.state.info.componentStack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '20px', background: '#f97316', color: '#000',
                            border: 'none', padding: '12px 24px', borderRadius: '8px',
                            cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
                        }}
                    >
                        Recargar Sistema
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <div className="h-screen w-screen bg-black overflow-hidden">
                <ExperimentCenterUI />
            </div>
        </ErrorBoundary>
    </React.StrictMode>
);
