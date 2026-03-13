import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // 👈 นำเข้ายามของเรา

function App() {
    return (
        <Router>
            <Routes>
                {/* หน้า Login ใครเข้าก็ได้ ไม่ต้องมียามเฝ้า */}
                <Route path="/login" element={<Login />} />
                
                {/* ล็อคหน้า Projects */}
                <Route path="/projects" element={
                    <ProtectedRoute>
                        <Projects />
                    </ProtectedRoute>
                } />
                
                {/* ล็อคหน้า Board */}
                <Route path="/board/:projectId" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                {/* ถ้าพิมพ์ URL มั่วๆ หรือเข้ามาหน้า / เฉยๆ ให้โยนไปหน้า projects (เดี๋ยวยามจะไล่ไป login เองถ้ายังไม่เข้าระบบ) */}
                <Route path="*" element={<Navigate to="/projects" replace />} /> 
            </Routes>
        </Router>
    );
}

export default App;