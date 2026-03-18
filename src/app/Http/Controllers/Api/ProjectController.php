<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function index()
    {
        // ดึง Project ทั้งหมด (คุณสามารถเพิ่ม ->with('boards') ได้ถ้าต้องการ)
        $projects = Project::all();

        return response()->json([
            'status' => 'success',
            'data' => $projects
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'workspace_id' => 'required|exists:workspaces,id',
        ]);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($request) {

            // 1. ตัดคำภาษาไทยให้ถูกต้อง (ตัดมา 3 ตัวอักษร ไม่ใช่ 3 ไบต์)
            $baseKey = mb_strtoupper(mb_substr($request->name, 0, 3, 'UTF-8'));
            $key = $baseKey;
            $counter = 1;

            // 2. ป้องกัน Key ซ้ำ (ถ้ามี Key นี้อยู่แล้ว ให้เติม -1, -2 ต่อท้าย)
            while (\App\Models\Project::where('key', $key)->exists()) {
                $key = $baseKey . '-' . $counter;
                $counter++;
            }

            // 3. สร้าง Project
            $project = \App\Models\Project::create([
                'name' => $request->name,
                'key' => $key,
                'description' => $request->description,
                'workspace_id' => $request->workspace_id,
            ]);

            // 4. สร้าง Board มาตรฐาน
            $defaultBoards = ['To Do', 'In Progress', 'Done'];
            foreach ($defaultBoards as $index => $boardName) {
                \App\Models\Board::create([
                    'name' => $boardName,
                    'position' => $index,
                    'project_id' => $project->id
                ]);
            }

            return response()->json(['status' => 'success', 'data' => $project], 201);
        });
    }
}
