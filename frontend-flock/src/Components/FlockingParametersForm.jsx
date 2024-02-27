import React, { useState } from 'react';
import axios from 'axios';

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
              {/* Example for one slider; replicate for others */}
              <label>
                  Cohesion Range:
                  <input
                      type="range"
                      name="cohesionRange"
                      min="0"
                      max="10"
                      value={parameters.cohesionRange}
                      onChange={handleInputChange}
                      style={{ display: 'block', width: '50%' }}
                  />
                  {parameters.cohesionRange}
              </label>
              <label>
                  Alignment Range:
                  <input
                      type="range"
                      name="alignmentRange"
                      min="0"
                      max="10"
                      value={parameters.alignmentRange}
                      onChange={handleInputChange}
                      style={{ display: 'block', width: '50%' }}
                  />
                  {parameters.alignmentRange}
              </label>
              <label>
                  Separation Range:
                  <input
                      type="range"
                      name="separationRange"
                      min="0"
                      max="10"
                      value={parameters.separationRange}
                      onChange={handleInputChange}
                      style={{ display: 'block', width: '50%' }}
                  />
                  {parameters.separationRange}
              </label>
              <label>
                  Cohesion Scale:
                  <input
                      type="range"
                      name="cohesionScale"
                      min="0"
                      max="10"
                      value={parameters.cohesionScale}
                      onChange={handleInputChange}
                      style={{ display: 'block', width: '50%' }}
                  />
                  {parameters.cohesionScale}
              </label>
              <label>
                  Alignment Scale:
                  <input
                      type="range"
                      name="alignmentScale"
                      min="0"
                      max="10"
                      value={parameters.alignmentScale}
                      onChange={handleInputChange}
                      style={{ display: 'block', width: '50%' }}
                  />
                  {parameters.alignmentScale}
              </label>
              <label>
                  Separation Scale:
                  <input
                      type="range"
                      name="separationScale"
                      min="0"
                      max="10"
                      value={parameters.separationScale}
                      onChange={handleInputChange}
                      style={{ display: 'block', width: '50%' }}
                  />
                  {parameters.separationScale}
              </label>
              {/* Add other sliders for separationRange, alignmentRange, etc. */}
              <button type="submit">Update Parameters</button>
          </form>
          <form onSubmit={handleResetSubmit}>
              <button type="submit">Reset</button>
          </form>
        </>
    );
};

export default FlockingParametersForm;
