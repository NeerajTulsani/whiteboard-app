import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      setUser({ username: response.data.username });
      setError('');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setRoomId('');
    setJoined(false);
  };

  return (
    <div className="login-container">
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
