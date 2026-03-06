ระบบ Backend API สำหรับจัดการงานในรูปแบบ Kanban Board พัฒนาด้วย Laravel 11 บน Docker Environment

🚀 Key Features & Technical Highlights
Authentication & Security:

ระบบยืนยันตัวตนด้วย JWT (JSON Web Token)

File Upload Security: ตรวจสอบ MIME Type และเนื้อหาไฟล์จริง (Deep Check) เพื่อป้องกันไฟล์อันตราย

Data Integrity & Consistency:

Database Transactions: ใช้ DB::transaction ครอบคลุมจุดสำคัญ เช่น การสร้าง Project พร้อม Board และการลบ Attachment พร้อมไฟล์ใน Storage เพื่อป้องกัน Data Inconsistency

Pessimistic Locking: ใช้ lockForUpdate() ในการคำนวณ Task Number (เช่น E-C-1) เพื่อป้องกันการเกิดเลขซ้ำในกรณี Race Condition

System Automation:

Eloquent Observers: ใช้ Observer Pattern ในการทำ Activity Log บันทึกประวัติการขยับสถานะงานอัตโนมัติ (Audit Trail)

Advanced Relationships:

จัดการโครงสร้างข้อมูลแบบ Workspace > Project > Board > Task > Comments/Attachments ด้วย Eloquent Relationship

🛠 Tech Stack
Framework: Laravel 11

Database: PostgreSQL / MySQL (Managed via DBeaver)

Containerization: Docker & Docker Compose

API Testing: Bruno / Postman