import React, { useState } from 'react';
import './Loginpage.css';
import { useNavigate } from 'react-router-dom';

function Loginpage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    // alert(`Role: ${role}\nEmail: ${email}\nPassword: ${password}`);
    //navigate('/chat');
    setMessage('');

    try {
      const res = await fetch('http://localhost:8080/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      if (res.ok) { 
       setTimeout(() => navigate('/chat'), 1000);
      } else if (res.status === 401) {
        setMessage('Login failed: Invalid username or password');
      } else {
        setMessage('Login failed: Server error');
      }
    } catch (err) {
      setMessage('Login failed: Network error');
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
      <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
              style={{ textAlign: 'center' }}
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
              style={{ textAlign: 'center' }}
          />
        </div>
        <button type="submit">Log In</button>

        {message && (
          <p
            className={`login-message ${message.startsWith('Welcome') ? 'success' : 'error'}`}
          >
            {message}
          </p>
        )}

      </form>
    </div>
  );
}

export default Loginpage;







