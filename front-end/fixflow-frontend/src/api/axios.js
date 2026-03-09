import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // บังคับให้ Axios ส่ง Cookie ไปพร้อม Request
});

// ทุกครั้งที่ยิง API จะแอบเอา Token ในเครื่องส่งไปด้วย

export default api;