import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Whiteboard.css';

const Whiteboard = ({ user, roomId, onLeave, onLogout }) => {
  const [brushRadius, setBrushRadius] = useState(4);
  const socketRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const isInitialized = useRef(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;
    socketRef.current = io('http://localhost:4000');
    const socket = socketRef.current;
    console.log('Connecting to room:', roomId);
    socket.emit('joinRoom', { roomId, username: user.username });

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    socket.on('load', (data) => {
      data.forEach((d) => {
        const { x, y, color, radius } = d;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
      });
    });

    socket.on('draw', ({ data, connectionId }) => {
      if (connectionId !== socket.id) {
        const { x, y, color, radius } = data;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
      }
    });

    socket.on('roomUsers', (users) => {
      console.log('users', users);
      setUsers(users);
    });

    // return () => {
    //   socket.emit('leaveRoom', { roomId, username: user.username });
    //   socket.disconnect();
    // };
  }, [roomId, user.username]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    contextRef.current.beginPath();
    contextRef.current.arc(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop, brushRadius, 0, Math.PI * 2);
    contextRef.current.fillStyle = color;
    contextRef.current.fill();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    contextRef.current.beginPath();
    contextRef.current.arc(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop, brushRadius, 0, Math.PI * 2);
    contextRef.current.fillStyle = color;
    contextRef.current.fill();

    socketRef.current.emit('draw', { data: {
      x: e.clientX - canvasRef.current.offsetLeft,
      y: e.clientY - canvasRef.current.offsetTop,
      color: color,
      radius: brushRadius
    }, connectionId: socketRef.current.id });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    contextRef.current.beginPath();
  };

  const saveSession = async () => {
    socketRef.current.emit('saveSession');
  };

  const handleLeave = () => {
    socketRef.current.emit('leaveRoom', { roomId, username: user.username });
    onLeave();
  }

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <h2>Room: {roomId}</h2>
        <h3>Users:</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
        <button onClick={handleLeave}>Leave Room</button>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        style={{ border: '1px solid black' }}
      />
      <div className="controls">
        <label>
          Brush Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Brush Radius:
          <input
            type="number"
            value={brushRadius}
            onChange={(e) => setBrushRadius(parseInt(e.target.value))}
          />
        </label>
        <button onClick={saveSession}>Save Session</button>
      </div>
    </div>
  );
};

export default Whiteboard;
