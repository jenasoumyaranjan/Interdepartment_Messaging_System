import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const departments = [
    'Electrical',
    'Mechanical',
    'Production',
    'Metal Yard',
    'Quality',
    'Raw Materials',
    'HR & Admin'
];

const roles = [
    'Head',
    'Manager',
    'Assistant Manager',
    'Executive',
    'Trainee'
];

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        department: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert('Registered successfully!');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="form-container">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                />
                <select
                    name="department"
                    onChange={handleChange}
                    value={formData.department}
                    required
                >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <select
                    name="role"
                    onChange={handleChange}
                    value={formData.role}
                    required
                >
                    <option value="">-- Select Role --</option>
                    {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>



                <button type="submit">Register</button>
                <p onClick={() => navigate('/')} className="form-switch">
                    Already have an account? Login
                </p>
            </form>
        </div>
    );
}

export default Register;
