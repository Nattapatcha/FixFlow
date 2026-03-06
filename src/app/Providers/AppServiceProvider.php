<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Task;
use App\Observers\TaskObserver;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // บอกให้ Laravel รู้ว่า "ถ้า Task มีการขยับ ให้เรียกใช้ TaskObserver นะ"
        Task::observe(TaskObserver::class);
    }
}
