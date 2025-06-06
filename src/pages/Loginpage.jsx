import React, { useState } from 'react';
import './Loginpage.css';
import { useNavigate } from 'react-router-dom';

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    // alert(`Role: ${role}\nEmail: ${email}\nPassword: ${password}`);
    navigate('/chat');
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
      <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
              style={{ textAlign: 'center' }}
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
              style={{ textAlign: 'center' }}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Loginpage;







