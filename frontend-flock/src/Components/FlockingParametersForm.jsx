import React, { useState } from 'react';
import axios from 'axios';
import SliderInput from './SliderInput';

const FlockingParametersForm = () => {
    const [parameters, setParameters] = useState({
        cohesionRange: 1.0,
        separationRange: 5.0,
        alignmentRange: 8.0,
        cohesionScale: 1.0,
        separationScale: 2.5,
        alignmentScale: 1.5,
    });

    const handleInputChange = (e) => {
        setParameters({
            ...parameters,
            [e.target.name]: parseFloat(e.target.value),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    onChange={handleInputChange}
                />
                <SliderInput
                    label="Alignment Range"
                    name="alignmentRange"
                    value={parameters.alignmentRange}
                    onChange={handleInputChange}
                />
                <SliderInput
                    label="Separation Range"
                    name="separationRange"
                    value={parameters.separationRange}
                    onChange={handleInputChange}
                />
                <SliderInput
                    label="Cohesion Scale"
                    name="cohesionScale"
                    value={parameters.cohesionScale}
                    onChange={handleInputChange}
                />
                <SliderInput
                    label="Alignment Scale"
                    name="alignmentScale"
                    value={parameters.alignmentScale}
                    onChange={handleInputChange}
                />
                <SliderInput
                    label="Separation Scale"
                    name="separationScale"
                    value={parameters.separationScale}
                    onChange={handleInputChange}
                />
                <button type="submit">Update Parameters</button>
            </form>
            <form onSubmit={handleResetSubmit}>
                <button type="submit">Reset</button>
            </form>
        </>
    );
};

export default FlockingParametersForm;
