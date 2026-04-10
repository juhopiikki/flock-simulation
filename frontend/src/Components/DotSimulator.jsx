import React, { useRef, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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
    const color = `rgb(40, 80, 160)` //  calculateColorBasedOnSpeed(boid.vx, boid.vy, minSpeed, maxSpeed);

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
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: () => {},
      onConnect: () => {
        client.subscribe('/topic/position', (message) => {
          const { boids } = JSON.parse(message.body);
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scalingFactor = 1.8;
            const offsetX = 850;
            const offsetY = 500;
            boids.forEach((boid) => {
              drawBoidAsArrow(ctx, boid, scalingFactor, offsetX, offsetY);
            });
          }
        });
      },
    });

    client.activate();

    return () => client.deactivate();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width="1700"
        height="1000"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          backgroundColor: '#ffffff',
        }}>
      </canvas>

      {showParameters && (
        <div style={{
          position: 'absolute',
          top: 50,
          left: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
          padding: '12px 16px',
          zIndex: 2,
          minWidth: '300px',
        }}>
          <FlockingParametersForm />
        </div>
      )}

      <button onClick={toggleParameters} style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 3,
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '6px',
        padding: '6px 10px',
        cursor: 'pointer',
      }}>
        <FontAwesomeIcon icon={faCog} />
      </button>
    </div>
  );
};

export default DotSimulator;
