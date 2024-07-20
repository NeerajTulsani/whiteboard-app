import React, { useState } from 'react';
import Login from './Login';
import Room from './Room';
import Whiteboard from './Whiteboard';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);

  const handleLeave = () => {
    if (roomId) {
        setRoomId('');
        setJoined(false);
    }
  }

  const handleLogout = () => {
    setUser(null);
    setRoomId('');
    setJoined(false);
  };

  return (
    <div className="app">
      {!user ? (
        <Login setUser={setUser} />
      ) : !joined ? (
        <Room user={user} setRoomId={setRoomId} setJoined={setJoined} onLogout={handleLogout} />
      ) : (
        <Whiteboard user={user} roomId={roomId} onLeave={handleLeave} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
