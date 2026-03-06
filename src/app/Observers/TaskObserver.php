<?php

namespace App\Observers;

use App\Models\Task;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        //
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        if ($task->isDirty('board_id')) { // ถ้ามีการย้ายบอร์ด
        \App\Models\ActivityLog::create([
            'task_id' => $task->id,
            'user_id' => auth()->id(),
            'activity_type' => 'move_task',
            'old_value' => $task->getOriginal('board_id'),
            'new_value' => $task->board_id,
        ]);
    }
    }

    /**
     * Handle the Task "deleted" event.
     */
    public function deleted(Task $task): void
    {
        //
    }

    /**
     * Handle the Task "restored" event.
     */
    public function restored(Task $task): void
    {
        //
    }

    /**
     * Handle the Task "force deleted" event.
     */
    public function forceDeleted(Task $task): void
    {
        //
    }
}
