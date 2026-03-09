import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            // เก็บกุญแจไว้ในเครื่อง
            localStorage.setItem('token', response.data.access_token);
            alert('Login สำเร็จ!');
            navigate('/'); // พาไปหน้า Dashboard
        } catch (error) {
            alert('Email หรือ Password ไม่ถูกต้อง');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: '400px' }}>
                <h3 className="text-center mb-4 fw-bold text-primary">FixFlow Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2">เข้าสู่ระบบ</button>
                </form>
            </div>
        </div>
    );
};

export default Login;