<?php
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\AttachmentController;


Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->group(function () {
    // API สำหรับดึงรายชื่อ Workspace ของผู้ใช้ที่ Login อยู่
    Route::get('/workspaces', [WorkspaceController::class, 'index']);
    Route::post('/workspaces', [WorkspaceController::class, 'store']);
    // เพิ่ม API สำหรับ Project
    Route::post('/projects', [ProjectController::class, 'store']);
    // API สำหรับสร้างงาน
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks', [TaskController::class, 'index']);
    // ดึงประวัติทั้งหมดของ Task ชิ้นนั้นๆ
    Route::get('/tasks/{task}/activities', function($taskId) {
        return \App\Models\ActivityLog::with('user:id,name')
            ->where('task_id', $taskId)
            ->latest()
            ->get();
    });
    Route::patch('/tasks/{id}', [TaskController::class, 'update']);
    Route::post('/boards', [BoardController::class, 'store']);
    Route::get('/tasks/{task}/comments', [CommentController::class, 'index']);  // ดึงคอมเมนต์ทั้งหมดของงานนี้
    Route::post('/tasks/{task}/comments', [CommentController::class, 'store']); // เพิ่มคอมเมนต์ใหม่
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']); // ลบคอมเมนต์ (เจ้าของลบเอง)
    Route::delete('/attachments/{id}', [AttachmentController::class, 'destroy'])->middleware('auth:api');
    Route::post('/attachments', [AttachmentController::class, 'store'])->middleware('auth:api');
});