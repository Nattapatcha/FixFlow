<?php

namespace App\Http\Controllers\Api;
use App\Models\Board;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index(Request $request)
    {
        // บังคับว่าต้องส่ง project_id มาด้วย
        $request->validate(['project_id' => 'required|exists:projects,id']);

        // ดึง Board ทั้งหมดของโปรเจกต์นี้ เรียงตามลำดับ (position)
        $boards = Board::where('project_id', $request->project_id)
                       ->orderBy('position', 'asc')
                       ->get();

        return response()->json([
            'status' => 'success',
            'data' => $boards
        ]);
    }
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:100',
        'project_id' => 'required|exists:projects,id',
        'position' => 'nullable|integer'
    ]);

    $board = \App\Models\Board::create([
        'name' => $request->name,
        'project_id' => $request->project_id,
        'position' => $request->position ?? 0
    ]);

    return response()->json(['message' => 'Board created', 'data' => $board], 201);
}
}
