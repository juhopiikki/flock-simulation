import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SliderInput from './SliderInput';

const FlockingParametersForm = () => {
    const [parameters, setParameters] = useState({
        cohesionRange: 8.0,
        alignmentRange: 6.0,
        separationRange: 3.0,
        cohesionScale: 1.0,
        alignmentScale: 1.0,
        separationScale: 2.5,
    });

    // Fetch parameters when component mounts
    useEffect(() => {
        const fetchParameters = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/parameters/current');
                setParameters(response.data);
            } catch (error) {
                console.error('Error fetching parameters:', error);
                alert('Failed to fetch parameters');
            }
        };

        fetchParameters();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setParameters({
            ...parameters,
            [e.target.name]: parseFloat(e.target.value),
        });
        try {
            const response = await axios.post('http://localhost:8080/api/parameters/update', parameters);
            //alert(response.data);
        } catch (error) {
            console.error("Error updating parameters:", error);
            alert('Failed to update parameters');
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/parameters/reset');
            //alert(response.data);
        } catch (error) {
            console.error("Error resetting:", error);
            alert('Failed to reset');
        }
    };

    return (
        <>
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
                <button type="submit">Reset</button>
            </form>
        </>
    );
};

export default FlockingParametersForm;
