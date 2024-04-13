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

  const calculateColorBasedOnSpeed = (velocityX, velocityY, minSpeed, maxSpeed) => {
    const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    const normalizedSpeed = (speed - minSpeed) / (maxSpeed - minSpeed);
    
    // Ensure the value is between 0 and 1
    const clampedSpeed = Math.max(0.5, Math.min(0.8, normalizedSpeed));
    
    // Interpolate between green (slow) and red (fast)
    const r = (1 - clampedSpeed) * 255;
    const g = (1 - clampedSpeed) * 255; // (1 - clampedSpeed) * 255;
    const b = (1 - clampedSpeed) * 255; // 50;
    
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${b})`;
  };

  const drawBoidAsArrow = (ctx, boid, scalingFactor, offsetX, offsetY) => {
    const headLength = 12; // Length from base to tip of the arrowhead
    const headWidth = 9; // Width of the arrowhead base

    const minSpeed = 1.5
    const maxSpeed = 2.0
  
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

    // Determine the color based on speed
    const color = `rgb(50, 50, 50)` //  calculateColorBasedOnSpeed(boid.vx, boid.vy, minSpeed, maxSpeed);

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(tipX, tipY); // Start at the tip
    ctx.lineTo(baseLeftX, baseLeftY); // Draw to one base point
    ctx.lineTo(baseRightX, baseRightY); // Draw to the other base point
    ctx.closePath(); // Close the path to form a triangle
    ctx.fillStyle = color;
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

          // Set the background to black
          // ctx.fillStyle = 'black';
          // ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const scalingFactor = 1.8;
          const offsetX = 850;
          const offsetY = 500;
          const boidSize = 2.5

          ctx.globalAlpha = 1.0;
          // Draw each boid as an arrow
          boids.forEach((boid) => {
            drawBoidAsArrow(ctx, boid, scalingFactor, offsetX, offsetY);
          });
          // or as a dot
          // boids.forEach((boid) => {
          //   ctx.beginPath();
          //   ctx.arc(offsetX + boid.x * scalingFactor, offsetY + boid.y * scalingFactor, boidSize, 0, 2 * Math.PI);
          //   ctx.fillStyle = 'black';
          //   ctx.fill();
          // });

          // Draw average position
          // ctx.globalAlpha = 1.0;
          // ctx.beginPath();
          // ctx.arc(offsetX + averagePosition.x * scalingFactor, offsetY + averagePosition.y * scalingFactor, boidSize, 0, 2 * Math.PI);
          // ctx.fillStyle = 'red';
          // ctx.fill();
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
