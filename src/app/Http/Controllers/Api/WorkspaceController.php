<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    public function index()
    {
        // ดึงข้อมูลผู้ใช้จาก Token และดึง Workspace ที่เขาเป็นเจ้าของ
        $workspaces = auth()->user()->workspaces;

        return response()->json([
            'status' => 'success',
            'count' => $workspaces->count(),
            'data' => $workspaces
        ]);
    }
    public function store(Request $request)
    {
        // 1. Validation - ตรวจสอบความถูกต้องของข้อมูล
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // 2. Create - สร้างข้อมูลโดยผูกกับ User ID ที่ Login อยู่
        $workspace = \App\Models\Workspace::create([
            'name' => $request->name,
            'owner_id' => auth()->id(), // ดึง ID จาก JWT Token
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Workspace created successfully',
            'data' => $workspace
        ], 201); // 201 คือ HTTP Status สำหรับ Created
    }
}
