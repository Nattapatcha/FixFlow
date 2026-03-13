import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/login', { email, password });
            
            // ติดป้ายบอก React ว่า Login แล้ว
            localStorage.setItem('isAuthenticated', 'true');
            
            navigate('/projects'); // พาไปหน้าเลือกโปรเจกต์
        } catch (error) {
            alert('Login ไม่สำเร็จ ตรวจสอบ Email หรือ Password ครับ');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-sm p-4" style={{ width: '400px' }}>
                <h3 className="text-center mb-4 fw-bold text-primary">FixFlow Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2">เข้าสู่ระบบ</button>
                </form>
            </div>
        </div>
    );
}

export default Login;