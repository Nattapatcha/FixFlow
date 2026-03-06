<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'board_id' => 'required|exists:boards,id'
        ]);

        // ดึง Task พร้อมข้อมูลผู้รับผิดชอบ (Eager Loading เพื่อแก้ N+1 Problem)
        $tasks = Task::with('user')
            ->where('board_id', $request->board_id)
            ->orderBy('priority', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $tasks
        ]);
    }
    public function store(Request $request)
{
    // 1. Validation ยังต้องเป๊ะเหมือนเดิม
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'board_id' => 'required|exists:boards,id',
        'priority' => 'in:low,medium,high',
        'due_date' => 'nullable|date',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // 2. ใช้ Transaction คลุม Business Logic ทั้งหมด
    return DB::transaction(function () use ($request) {
        
        // ใช้ lockForUpdate() เพื่อป้องกันไม่ให้ใครมาแทรกแซงข้อมูล Board/Project ในขณะที่เรากำลังคำนวณเลข
        $board = \App\Models\Board::with('project')->lockForUpdate()->find($request->board_id);
        $projectKey = $board->project->key;

        // นับจำนวน Task ทั้งหมดภายใต้ Project นี้
        $taskCount = \App\Models\Task::whereHas('board', function ($query) use ($board) {
            $query->where('project_id', $board->project_id);
        })->count() + 1;

        $taskNumber = "{$projectKey}-{$taskCount}";

        // บันทึก Task พร้อมเลขลำดับ
        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'task_number' => $taskNumber, // อย่าลืมใส่เลขที่คำนวณได้ลงไปด้วยครับ
            'priority' => $request->priority ?? 'medium',
            'board_id' => $request->board_id,
            'user_id' => auth()->id(),
            'due_date' => $request->due_date,
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'data' => $task
        ], 201);
    });
}
    public function update(Request $request, $id)
{
    $task = Task::findOrFail($id);

    // Validation - ตรวจสอบเฉพาะฟิลด์ที่ส่งมา
    $request->validate([
        'title' => 'sometimes|string|max:255',
        'board_id' => 'sometimes|exists:boards,id',
        'priority' => 'sometimes|in:low,medium,high',
        'status' => 'sometimes|string'
    ]);

    // การใช้ update() ตรงนี้จะไป Trigger 'updated' ใน TaskObserver อัตโนมัติ
    $task->update($request->all());

    return response()->json([
        'status' => 'success',
        'message' => 'Task updated successfully',
        'data' => $task->load('board') // โหลดข้อมูลบอร์ดใหม่กลับไปด้วย
    ]);
}
}
