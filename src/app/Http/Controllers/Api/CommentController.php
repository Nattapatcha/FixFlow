<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index($taskId)
    {
        $comments = Comment::with('user:id,name') // Eager load เฉพาะชื่อคนคอมเมนต์
            ->where('task_id', $taskId)
            ->latest()
            ->get();

        return response()->json(['status' => 'success', 'data' => $comments]);
    }
    public function store(Request $request, $taskId)
    {
        $request->validate(['content' => 'required|string']);

        $comment = Comment::create([
            'content' => $request->input('content'),
            'task_id' => $taskId,
            'user_id' => Auth::id(), // แก้ Error Visibility ด้วยการใช้ Auth Facade
        ]);

        return response()->json(['status' => 'success', 'data' => $comment->load('user:id,name')], 201);
    }
    public function destroy(Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        return response()->json(['status' => 'success', 'message' => 'Comment deleted']);
    }
}
