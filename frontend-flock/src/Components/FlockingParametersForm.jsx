import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SliderInput from './SliderInput';

const FlockingParametersForm = () => {
    const [parameters, setParameters] = useState({
        cohesionRange: 5.5,
        alignmentRange: 7.2,
        separationRange: 7.1,
        cohesionScale: 0.5,
        alignmentScale: 1.3,
        separationScale: 2.8,
    });
    const [boidCount, setBoidCount] = useState(2000);
    const [backendStatus, setBackendStatus] = useState('connecting');

    // Fetch parameters when component mounts
    useEffect(() => {
        const fetchParameters = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/parameters/current');
                setParameters(response.data);
                setBackendStatus('connected');
            } catch (error) {
                console.error('Error fetching parameters:', error);
                setBackendStatus('offline');
            }
        };

        fetchParameters();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setParameters({
            ...parameters,
            [e.target.name]: parseFloat(e.target.value),
        });
        try {
            await axios.post('http://localhost:8080/api/parameters/update', parameters);
        } catch (error) {
            console.error("Error updating parameters:", error);
            setBackendStatus('offline');
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/parameters/reset', { amount: boidCount });
        } catch (error) {
            console.error("Error resetting:", error);
            setBackendStatus('offline');
        }
    };

    const handleRandomize = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/parameters/randomize');
            setParameters(response.data);
        } catch (error) {
            console.error("Error randomizing:", error);
            setBackendStatus('offline');
        }
    };

    const statusStyle = {
        fontSize: '0.8em',
        marginBottom: '8px',
        color: backendStatus === 'connected' ? 'green' : backendStatus === 'offline' ? 'red' : 'gray',
    };

    const statusText = {
        connected: null,
        offline: 'Backend offline — start the server',
        connecting: 'Connecting to backend...',
    }[backendStatus];

    return (
        <>
            <div style={statusStyle}>{statusText}</div>
            <form onSubmit={handleSubmit}>
                <SliderInput
                    label="Cohesion Range"
                    name="cohesionRange"
                    value={parameters.cohesionRange}
                    onChange={handleSubmit}
                />
                <SliderInput
                    label="Alignment Range"
                    name="alignmentRange"
                    value={parameters.alignmentRange}
                    onChange={handleSubmit}
                />
                <SliderInput
                    label="Separation Range"
                    name="separationRange"
                    value={parameters.separationRange}
                    onChange={handleSubmit}
                />
                <SliderInput
                    label="Cohesion Scale"
                    name="cohesionScale"
                    value={parameters.cohesionScale}
                    onChange={handleSubmit}
                />
                <SliderInput
                    label="Alignment Scale"
                    name="alignmentScale"
                    value={parameters.alignmentScale}
                    onChange={handleSubmit}
                />
                <SliderInput
                    label="Separation Scale"
                    name="separationScale"
                    value={parameters.separationScale}
                    onChange={handleSubmit}
                />
            </form>
            <form onSubmit={handleResetSubmit}>
                <SliderInput
                    label="Boid Count"
                    name="boidCount"
                    value={boidCount}
                    onChange={(e) => setBoidCount(parseInt(e.target.value))}
                    min="100"
                    max="6000"
                    step="100"
                />
                <button type="submit">Reset</button>
                <button type="button" onClick={handleRandomize} style={{ marginLeft: '8px' }}>Randomize</button>
            </form>
        </>
    );
};

export default FlockingParametersForm;
