import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const { projectId } = useParams();
  const [boards, setBoards] = useState([]); // เก็บรายการคอลัมน์
  const [tasks, setTasks] = useState([]); // เก็บรายการการ์ด
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // ฟังก์ชันดึงข้อมูลแบบคู่ขนาน (ดึง Board และ Task พร้อมกัน)
  const fetchData = async () => {
    setLoading(true);
    try {
      const [boardsRes, tasksRes] = await Promise.all([
        api.get(`/boards?project_id=${projectId}`),
        api.get(`/tasks?project_id=${projectId}`),
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
      await api.post("/tasks", {
        title: newTaskTitle,
        board_id: boardId, // ✅ ส่ง ID บอร์ดของจริงแบบ Dynamic
        project_id: projectId, // ✅ ส่ง ID โปรเจกต์ปัจจุบัน
        priority: "low", // ✅ ใช้ตัวพิมพ์เล็กเพื่อกัน Validation Error
        description: "",
      });

      setNewTaskTitle("");
      fetchData();
    } catch (error) {
      console.error("Error creating task:", error.response?.data);
      alert(
        "ไม่สามารถสร้าง Task ได้: " +
          JSON.stringify(error.response?.data?.errors),
      );
    }
  };
  // ฟังก์ชันจัดการตอนที่ "ปล่อยเมาส์" หลังลากเสร็จ
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newBoardId = parseInt(destination.droppableId);

    // 1. อัปเดต UI ทันที
    const updatedTasks = tasks.map((task) =>
      task.id.toString() === draggableId
        ? { ...task, board_id: newBoardId }
        : task,
    );
    setTasks(updatedTasks);

    // 2. ยิง API (สำคัญ: ต้องใช้ Backtick ` เพื่อให้มันอ่านค่าตัวแปร draggableId ได้)
    try {
      await api.patch(`/tasks/${draggableId}`, {
        board_id: newBoardId,
      });
    } catch (error) {
      console.error("Drag update error:", error);
      fetchData(); // ถ้า API พัง ให้ดึงข้อมูลเก่ากลับมาแสดง
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <nav className="navbar navbar-dark bg-primary shadow-sm mb-4 rounded px-3">
        <span className="navbar-brand mb-0 h1">🚀 FixFlow</span>
      </nav>

      {/* 🎯 ครอบทั้งกระดานด้วย DragDropContext */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="row flex-nowrap overflow-auto px-3 pb-3"
          style={{ minHeight: "75vh" }}
        >
          {loading ? (
            <div className="text-center w-100 mt-5">กำลังโหลดกระดาน...</div>
          ) : boards.length === 0 ? (
            /* 🎯 ถ้า Backend ไม่ส่งกระดานมาเลย ให้โชว์หน้าจอนี้แทนหน้าขาวๆ */
            <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-5">
              <h3 className="text-muted fw-bold mb-3">
                📭 ยังไม่มีกระดานในโปรเจกต์นี้
              </h3>
              <p className="text-muted text-center">
                โปรเจกต์นี้อาจจะถูกสร้างก่อนที่จะมีระบบ Auto-generate Boards{" "}
                <br />
                แนะนำให้สร้างโปรเจกต์ใหม่เพื่อทดสอบระบบครับ
              </p>
            </div>
          ) : (
            boards.map((board, index) => (
              <div
                key={board.id}
                className="col-12 col-md-4 col-lg-3"
                style={{ minWidth: "320px" }}
              >
                <div className="card shadow-sm border-0 bg-light h-100">
                  <div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold text-secondary text-uppercase">
                      {board.name}
                    </h6>
                    <span className="badge bg-secondary rounded-pill">
                      {tasks.filter((t) => t.board_id === board.id).length}
                    </span>
                  </div>

                  {/* 🎯 ครอบพื้นที่ที่วางการ์ดได้ด้วย Droppable */}
                  <Droppable droppableId={board.id.toString()}>
                    {(provided, snapshot) => (
                      <div
                        className="card-body p-2 d-flex flex-column"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        // เปลี่ยนสีพื้นหลังนิดหน่อยเวลาลากการ์ดมาวางทับ
                        style={{
                          backgroundColor: snapshot.isDraggingOver
                            ? "#e2e8f0"
                            : "transparent",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {tasks
                          .filter((t) => t.board_id === board.id)
                          .map((task, taskIndex) => (
                            // 🎯 ครอบการ์ดแต่ละใบด้วย Draggable
                            <Draggable
                              key={task.id.toString()}
                              draggableId={task.id.toString()}
                              index={taskIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className="card mb-2 border-0 shadow-sm"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  // ทำให้การ์ดเอียงนิดๆ เวลาโดนลาก
                                  style={{
                                    ...provided.draggableProps.style,
                                    transform: snapshot.isDragging
                                      ? provided.draggableProps.style
                                          .transform + " rotate(2deg)"
                                      : provided.draggableProps.style.transform,
                                    cursor: "grab",
                                  }}
                                >
                                  <div className="card-body p-3">
                                    <div className="fw-bold text-dark">
                                      {task.title}
                                    </div>
                                    <span className="badge bg-info mt-2">
                                      {task.task_number || "NEW"}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}{" "}
                        {/* 👈 ต้องมีไว้กันพื้นที่กระดานยุบตัวตอนลากออก */}
                        {index === 0 && (
                          <form
                            onSubmit={(e) => handleAddTask(e, board.id)}
                            className="mt-auto pt-3"
                          >
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
                    )}
                  </Droppable>
                </div>
              </div>
            ))
          )}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;
