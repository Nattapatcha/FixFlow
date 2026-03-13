import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // State สำหรับ Modal สร้างโปรเจกต์
    const [showModal, setShowModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');

    // แยกฟังก์ชันดึงข้อมูลออกมา เพื่อให้เรียกซ้ำได้ตอนสร้างโปรเจกต์เสร็จ
    const fetchProjects = () => {
        api.get('/projects')
            .then(res => {
                setProjects(res.data.data || res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSelectProject = (projectId) => {
        navigate(`/board/${projectId}`);
    };

    // ฟังก์ชันยิง API สร้างโปรเจกต์ใหม่
    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        try {
            await api.post('/projects', {
                name: newProjectName,
                description: newProjectDesc,
                // จำเป็นต้องส่ง workspace_id ตาม Validation ใน Laravel ของคุณ
                workspace_id: 1 
            });
            
            // ล้างค่าฟอร์ม ปิด Modal และโหลดข้อมูลใหม่
            setNewProjectName('');
            setNewProjectDesc('');
            setShowModal(false);
            setLoading(true);
            fetchProjects(); 
        } catch (error) {
            console.error("Error creating project:", error.response?.data);
            alert("สร้างโปรเจกต์ไม่สำเร็จ: " + JSON.stringify(error.response?.data?.errors || error.message));
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 py-5">
            <div className="container">
                {/* Header Row: มีปุ่มสร้างโปรเจกต์อยู่มุมขวาเสมอ */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-secondary m-0">🗂️ เลือกโปรเจกต์ของคุณ</h2>
                    <button 
                        className="btn btn-primary shadow-sm"
                        onClick={() => setShowModal(true)}
                    >
                        + สร้างโปรเจกต์ใหม่
                    </button>
                </div>
                
                {loading ? (
                    <div className="text-center mt-5">กำลังโหลดข้อมูลโปรเจกต์...</div>
                ) : (
                    <div className="row g-4">
                        {projects.length > 0 ? projects.map(project => (
                            <div className="col-md-4" key={project.id}>
                                <div 
                                    className="card shadow-sm border-0 h-100" 
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                    onClick={() => handleSelectProject(project.id)}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <div className="card-body p-4">
                                        <h5 className="card-title fw-bold text-primary">{project.name}</h5>
                                        <p className="card-text text-muted small">
                                            {project.description || 'ไม่มีคำอธิบายโปรเจกต์'}
                                        </p>
                                    </div>
                                    <div className="card-footer bg-white border-top-0 text-end">
                                        <span className="text-primary small fw-bold">เข้าสู่กระดาน ➔</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-12 text-center text-muted mt-5">
                                <h5>ยังไม่มีโปรเจกต์ในระบบ</h5>
                                <p>คลิกปุ่มด้านขวาบนเพื่อเริ่มต้นโปรเจกต์แรกของคุณ</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Bootstrap Modal สำหรับสร้างโปรเจกต์ */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header bg-primary text-white border-0">
                                    <h5 className="modal-title">สร้างโปรเจกต์ใหม่</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleCreateProject}>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">ชื่อโปรเจกต์ <span className="text-danger">*</span></label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="เช่น ระบบ Helpdesk ภายใน"
                                                value={newProjectName}
                                                onChange={(e) => setNewProjectName(e.target.value)}
                                                required
                                            />
                                            <small className="text-muted">ระบบจะสร้าง Prefix รหัสงานให้จาก 3 ตัวอักษรแรก (เช่น HEL-1)</small>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">รายละเอียด (ทางเลือก)</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="3"
                                                placeholder="อธิบายสั้นๆ เกี่ยวกับโปรเจกต์นี้"
                                                value={newProjectDesc}
                                                onChange={(e) => setNewProjectDesc(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 bg-light">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>ยกเลิก</button>
                                        <button type="submit" className="btn btn-primary">บันทึกโปรเจกต์</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;