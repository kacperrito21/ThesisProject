import React, { useState } from 'react';
import apiService from '../services/api.service';

interface TestConnectionProps {}

const TestConnection: React.FC<TestConnectionProps> = () => {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const testAPI = async () => {
        setLoading(true);
        setError('');
        setResult('');
        try {
            const response = await apiService.testConnection();
            setResult(response);
        } catch (err: any) {
            setError(err.message || 'Connection failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Backend Connection Test</h2>
            <button
                onClick={testAPI}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Testing...' : 'Test Backend Connection'}
            </button>
            {result && (
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px'
                }}>
                    <strong>Success:</strong> {result}
                </div>
            )}
            {error && (
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default TestConnection;
