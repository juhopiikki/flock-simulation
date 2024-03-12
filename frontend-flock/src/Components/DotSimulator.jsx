import React, { useRef, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import FlockingParametersForm from './FlockingParametersForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const DotSimulator = () => {
  const [showParameters, setShowParameters] = useState(true);
  const canvasRef = useRef(null);

  const toggleParameters = () => {
    setShowParameters(!showParameters);
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log('Connected to the WebSocket server');
      stompClient.subscribe('/topic/position', (message) => {
        const { boids, averagePosition } = JSON.parse(message.body);
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const scalingFactor = 1.5;
          const offsetX = 400;
          const offsetY = 400;
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw each boid
          // ctx.globalAlpha = 0.4;
          boids.forEach((position) => {
            ctx.beginPath();
            ctx.arc((position.x + offsetX) * scalingFactor, (position.y + offsetY) * scalingFactor, 2.1, 1, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();
          });

          // Draw average position
          ctx.globalAlpha = 1.0;
          ctx.beginPath();
          ctx.arc((averagePosition.x + offsetX) * scalingFactor, (averagePosition.y + offsetY) * scalingFactor, 2.1, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      });
    });

    // Cleanup function
    /*return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log('Disconnected from the WebSocket server');
        });
      }
    };
*/
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <div style={{ position: 'relative' }}>
      <canvas 
        ref={canvasRef}
        width="1500"
        height="1000"
        style={{ 
          border: '1px solid black', 
          width: '100%', 
          height: 'auto' 
        }}>
      </canvas>

      {showParameters && (
        <div style={{
          position: 'absolute',
          top: 60,
          left: 10,
          backgroundColor: 'rgba(245, 245, 245, 0.5)', // Semi-transparent background
          padding: '10px',
          zIndex: 2, // Ensure the form appears above the canvas
        }}>
          <FlockingParametersForm />
        </div>
      )}

      <button onClick={toggleParameters} style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 3, // Ensure the button is always clickable and visible
      }}>
        <FontAwesomeIcon icon={faCog} />
      </button>
    </div>
/*
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <FlockingParametersForm />
        </div>
        <canvas ref={canvasRef} width="1500" height="1000" style={{ border: '1px solid black' }}></canvas>
      </div>
    </>*/
  );
};

export default DotSimulator;
