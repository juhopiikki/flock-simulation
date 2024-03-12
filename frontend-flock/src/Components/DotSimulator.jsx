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

  const drawBoidAsArrow = (ctx, boid, scalingFactor, offsetX, offsetY) => {
    const headLength = 9; // Length from base to tip of the arrowhead
    const headWidth = 6; // Width of the arrowhead base
  
    // Calculate the angle of the boid's velocity
    const angle = Math.atan2(boid.vy, boid.vx);

    // Calculate the starting point of the arrow (boid's position)
    const baseX = offsetX + boid.x * scalingFactor;
    const baseY = offsetY + boid.y * scalingFactor;

    // Calculate the tip of the arrowhead by extending from the base in the direction of the velocity
    const tipX = baseX + Math.cos(angle) * headLength;
    const tipY = baseY + Math.sin(angle) * headLength;

    // Calculate the two base points of the arrowhead, which create the width
    const baseLeftX = baseX + Math.cos(angle - Math.PI / 2) * (headWidth / 2);
    const baseLeftY = baseY + Math.sin(angle - Math.PI / 2) * (headWidth / 2);
    
    const baseRightX = baseX + Math.cos(angle + Math.PI / 2) * (headWidth / 2);
    const baseRightY = baseY + Math.sin(angle + Math.PI / 2) * (headWidth / 2);

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(tipX, tipY); // Start at the tip
    ctx.lineTo(baseLeftX, baseLeftY); // Draw to one base point
    ctx.lineTo(baseRightX, baseRightY); // Draw to the other base point
    ctx.closePath(); // Close the path to form a triangle
    ctx.fillStyle = 'green';
    ctx.fill();
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
          const scalingFactor = 1.8;
          const offsetX = 850;
          const offsetY = 500;
          const boidSize = 2.1
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.globalAlpha = 0.8;
          // Draw each boid as an arrow
          boids.forEach((boid) => {
            drawBoidAsArrow(ctx, boid, scalingFactor, offsetX, offsetY);
          });

          // Draw average position
          ctx.globalAlpha = 1.0;
          ctx.beginPath();
          ctx.arc(offsetX + averagePosition.x * scalingFactor, offsetY + averagePosition.y * scalingFactor, boidSize, 0, 2 * Math.PI);
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
        width="1700"
        height="1000"
        style={{ 
          width: '100%',
          height: 'auto' 
        }}>
      </canvas>

      {showParameters && (
        <div style={{
          position: 'absolute',
          top: 60,
          left: 10,
          backgroundColor: 'rgba(245, 245, 245, 0.5)',
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
  );
};

export default DotSimulator;
