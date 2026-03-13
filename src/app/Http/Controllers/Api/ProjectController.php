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

        return DB::transaction(function () use ($request) {
            // 1. สร้าง Project
            $key = strtoupper(substr($request->name, 0, 3));
            $project = Project::create([
                'name' => $request->name,
                'key' => $key,
                'description' => $request->description,
                'workspace_id' => $request->workspace_id,
            ]);

            // 2. สร้าง Board มาตรฐาน
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
