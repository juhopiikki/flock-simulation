import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import FlockingParametersForm from './FlockingParametersForm';

const DotSimulator = () => {
  const [positions, setPositions] = useState([]);
  const [avgPosition, setAvgPositions] = useState({});

  useEffect(() => {
    // Define `stompClient` in a scope accessible by the cleanup function
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log('Connected to the WebSocket server');
      stompClient.subscribe('/topic/position', (message) => {
        const newPositions = JSON.parse(message.body);
        // console.log(`got new positions`)
        setPositions(newPositions.boids);
        setAvgPositions(newPositions.averagePosition);
        // setPositions(newPosition.y);
      });

      // Trigger the simulation to start sending positions
      stompClient.send("/app/moveDot", {}, JSON.stringify({}));
    });

    // Cleanup function
    /*return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log('Disconnected from the WebSocket server');
        });
      }
    };
    setPositionX(90)
    setPositionY(0)*/
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    // <div style={{ position: 'relative', width: '200px', height: '200px', border: '1px solid black' }}>
    <>
      <FlockingParametersForm/>
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>

        {positions.map((position, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${400+position.x}%`,
              top: `${position.y}%`,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: 'black', // Feel free to change the color
              transform: 'translate(-50%, -50%)', // Centers the dot
              opacity: '0.4'
            }}
          ></div>
        ))}

        <div
            style={{
              position: 'absolute',
              left: `${400+avgPosition.x}%`,
              top: `${avgPosition.y}%`,
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: 'red', // Feel free to change the color
              transform: 'translate(-50%, -50%)', // Centers the dot
            }}
          ></div>
      </div>
    </>
  );
};

export default DotSimulator;
