# 🚀 FixFlow: Enterprise-Grade Task Management API

FixFlow คือระบบ Backend API สำหรับการจัดการ Task ในรูปแบบ Kanban Board ที่เน้นความถูกต้องของข้อมูล (Data Integrity) และความปลอดภัยสูงสุด พัฒนาด้วย Laravel 11 บน Docker Environment

## 🛠️ Technical Architect & Highlights

- **🔐 Security**: ระบบยืนยันตัวตนด้วย JWT และการตรวจสอบ MIME Type ไฟล์อัปโหลดเชิงลึก (Deep Check) เพื่อความปลอดภัย

- **💎 Data Integrity**: ใช้ Atomic Transactions และ Pessimistic Locking (lockForUpdate) เพื่อป้องกัน Data Inconsistency และ Race Condition

- **🤖 Automation**: ระบบ Activity Log (Audit Trail) อัตโนมัติผ่าน Eloquent Observers แยกส่วน Logic การบันทึกประวัติออกจาก Business Logic หลัก

- **📊 Complex Modeling**: การจัดการความสัมพันธ์แบบ Workspace > Project > Board > Task > Comments/Attachments

## 📂 Project Structure

เพื่อให้ผู้พัฒนาท่านอื่นเข้าใจโครงสร้างโปรเจกต์ได้รวดเร็ว:

```
.
├── docker/                 # Docker configuration files (PHP, Web Server, DB)
├── src/                    # Laravel Application Source Code
│   ├── app/
│   │   ├── Http/Controllers/Api/  # RESTful API Controllers
│   │   ├── Models/                # Eloquent Models with Relationships
│   │   └── Observers/             # Event Observers for Activity Logging
│   ├── database/migrations/       # Database Schema Definitions
│   └── routes/api.php             # API Route Definitions
└── docker-compose.yml      # Multi-container Docker orchestration
```

## 📦 Tech Stack

- **Framework**: Laravel 11
- **Database**: PostgreSQL / MySQL (Managed via DBeaver)
- **Containerization**: Docker & Docker Compose
- **API Testing**: Bruno / Postman

## 🚦 Getting Started

### Clone Project

```bash
git clone https://github.com/Nattapatcha/fixflow.git
```

### Environment Setup

```bash
cp src/.env.example src/.env
```

### Spin up Containers

```bash
docker-compose up -d
```

### Initial Setup

```bash
docker exec -it task-app php artisan migrate
docker exec -it task-app php artisan storage:link
```

