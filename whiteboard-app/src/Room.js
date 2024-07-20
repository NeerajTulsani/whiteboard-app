import React, { useState } from 'react';
import './Room.css';

const Room = ({ user, setRoomId, setJoined, onLogout }) => {
  const [room, setRoom] = useState('');

  const handleJoinRoom = () => {
    if (room) {
      setRoomId(room);
      setJoined(true);
    }
  };

  return (
    <div className="room-container">
      <h2>Welcome, {user.username}</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join/Create Room</button>
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Room;
