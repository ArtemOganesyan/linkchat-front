import React, { useState } from 'react';
import './Loginpage.css';
import { useNavigate } from 'react-router-dom';

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // New state for role
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    // alert(`Role: ${role}\nEmail: ${email}\nPassword: ${password}`);
    //navigate('/chat');
    setMessage('');

     if (email === 'admin@gmail.com' && password === 'test123') {
  localStorage.setItem('token', 'mock-token');
  localStorage.setItem('username', 'user');
  localStorage.setItem('role', role);

  setMessage('Welcome, user!');
  setTimeout(() => navigate('/chat'), 1000);
} else {
  setMessage('Login failed: Invalid email or password');
}

  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Role:</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
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







