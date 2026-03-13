import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
    const { projectId } = useParams();
    const [boards, setBoards] = useState([]); // เก็บรายการคอลัมน์
    const [tasks, setTasks] = useState([]);   // เก็บรายการการ์ด
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // ฟังก์ชันดึงข้อมูลแบบคู่ขนาน (ดึง Board และ Task พร้อมกัน)
    const fetchData = async () => {
        setLoading(true);
        try {
            const [boardsRes, tasksRes] = await Promise.all([
                api.get(`/boards?project_id=${projectId}`),
                api.get(`/tasks?project_id=${projectId}`)
            ]);

            setBoards(boardsRes.data.data || boardsRes.data);
            setTasks(tasksRes.data.data || tasksRes.data);
        } catch (err) {
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [projectId]);

    // รับค่า boardId เข้ามาด้วย เพื่อให้รู้ว่ากดสร้างการ์ดที่คอลัมน์ไหน
    const handleAddTask = async (e, boardId) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            await api.post('/tasks', {
                title: newTaskTitle,
                board_id: boardId,        // ✅ ส่ง ID บอร์ดของจริงแบบ Dynamic
                project_id: projectId,    // ✅ ส่ง ID โปรเจกต์ปัจจุบัน
                priority: 'low',          // ✅ ใช้ตัวพิมพ์เล็กเพื่อกัน Validation Error
                description: ''
            });
            
            setNewTaskTitle(''); 
            fetchData(); 
        } catch (error) {
            console.error("Error creating task:", error.response?.data);
            alert("ไม่สามารถสร้าง Task ได้: " + JSON.stringify(error.response?.data?.errors));
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 py-4">
            <nav className="navbar navbar-dark bg-primary shadow-sm mb-4 rounded px-3">
                <span className="navbar-brand mb-0 h1">🚀 FixFlow (Project ID: {projectId})</span>
            </nav>

            <div className="row flex-nowrap overflow-auto px-3 pb-3" style={{ minHeight: '75vh' }}>
                {loading ? (
                    <div className="text-center w-100 mt-5">กำลังโหลดกระดาน...</div>
                ) : (
                    // Loop สร้างคอลัมน์ (Boards) จากข้อมูลจริงใน Database
                    boards.map((board, index) => (
                        <div key={board.id} className="col-12 col-md-4 col-lg-3" style={{ minWidth: '320px' }}>
                            <div className="card shadow-sm border-0 bg-light h-100">
                                <div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 fw-bold text-secondary text-uppercase">{board.name}</h6>
                                    {/* นับจำนวนการ์ดในบอร์ดนี้ */}
                                    <span className="badge bg-secondary rounded-pill">
                                        {tasks.filter(t => t.board_id === board.id).length}
                                    </span>
                                </div>
                                
                                <div className="card-body p-2 d-flex flex-column">
                                    {/* นำ Tasks มา Filter โชว์เฉพาะที่ตรงกับคอลัมน์นี้ */}
                                    {tasks.filter(t => t.board_id === board.id).map(task => (
                                        <div key={task.id} className="card mb-2 border-0 shadow-sm" style={{ cursor: 'pointer' }}>
                                            <div className="card-body p-3">
                                                <div className="fw-bold text-dark">{task.title}</div>
                                                <span className="badge bg-info mt-2">{task.task_number || 'NEW'}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* แสดงฟอร์มสร้างการ์ด เฉพาะในคอลัมน์แรก (To Do) */}
                                    {index === 0 && (
                                        <form onSubmit={(e) => handleAddTask(e, board.id)} className="mt-auto pt-3">
                                            <input 
                                                type="text" 
                                                className="form-control border-0 shadow-sm" 
                                                placeholder="+ เพิ่มการ์ดใหม่ (กด Enter)" 
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                            />
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Dashboard;