import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './Form.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
     localStorage.setItem('data', JSON.stringify(res.data));
      alert('Login successful!');
      navigate('/messages');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };
useEffect(() => {
        cleanLocalStorage();
    }, []);

  return (
    <div className="form-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        <p onClick={() => navigate('/register')} className="form-switch">New user? Register</p>
      </form>
    </div>
  );
};
function cleanLocalStorage(){
localStorage.clear();
};

export default Login;
