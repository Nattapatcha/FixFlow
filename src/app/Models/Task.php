<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'task_number',
        'priority',
        'board_id',
        'user_id',
        'due_date'
    ];
    public function comments() {
    return $this->hasMany(Comment::class);
}
    public function board()
    {
        return $this->belongsTo(Board::class);
    }
}
