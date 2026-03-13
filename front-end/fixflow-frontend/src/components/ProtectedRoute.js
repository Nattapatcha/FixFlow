import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // เช็คว่ามีป้ายบอกว่า "เข้าสู่ระบบแล้ว" หรือไม่
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        // ถ้าไม่มีป้าย ให้ไล่กลับไปหน้า login ทันที
        return <Navigate to="/login" replace />;
    }

    // ถ้ามีป้าย ก็ให้ผ่านเข้าไปดูหน้าเว็บ (children) ได้
    return children;
};

export default ProtectedRoute;