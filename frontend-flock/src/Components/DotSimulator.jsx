import React, { useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import FlockingParametersForm from './FlockingParametersForm';

const DotSimulator = () => {
  const canvasRef = useRef(null);

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
          ctx.arc((averagePosition.x + offsetX) * scalingFactor, (averagePosition.y + offsetY) * scalingFactor, 1.5, 0, 2 * Math.PI);
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
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <FlockingParametersForm />
        </div>
        <canvas ref={canvasRef} width="1500" height="1000" style={{ border: '1px solid black' }}></canvas>
      </div>

    </>
  );
};

export default DotSimulator;
