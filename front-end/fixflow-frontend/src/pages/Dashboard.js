import React, { useEffect, useState } from "react";
// แก้ไข Path ตรงนี้: ถอยออกไป 1 ระดับด้วย ../ เพื่อเข้าหาโฟลเดอร์ api
import api from "../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";

// เปลี่ยนชื่อจาก function App() เป็น Dashboard ให้ตรงกับที่ App.js เรียกใช้
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tasks?board_id=1")
      .then((res) => {
        setTasks(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <nav className="navbar navbar-dark bg-primary shadow-sm mb-4 rounded">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">🚀 FixFlow Dashboard</span>
        </div>
      </nav>

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">TO DO</div>
            <div className="card-body bg-light" style={{ minHeight: "400px" }}>
              {loading ? (
                <p>กำลังโหลดข้อมูล...</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="card mb-2 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <div className="fw-bold mb-1">{task.task_number}</div>
                      <div>{task.title}</div>
                      <span className="badge bg-info mt-2">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ต้อง Export ชื่อ Dashboard ออกไป
export default Dashboard;
