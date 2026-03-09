import React from 'react'; // ต้องมี React เสมอ
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ตรวจสอบตัวพิมพ์ใหญ่-เล็กให้เป๊ะ
import Login from './pages/Login'; // ตรวจสอบว่ามีไฟล์ Login.js ในโฟลเดอร์ pages จริง
import Dashboard from './pages/Dashboard'; // ตรวจสอบว่ามีไฟล์ Dashboard.js ในโฟลเดอร์ pages จริง

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;