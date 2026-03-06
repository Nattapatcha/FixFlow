<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('key')->unique(); // เช่น "TASK", "WEB" เพื่อใช้ทำ Task ID (TASK-1, TASK-2)
            $table->text('description')->nullable();

            // เชื่อมไปยัง Workspace
            $table->foreignId('workspace_id')
                ->constrained()
                ->onDelete('cascade'); // ถ้าลบ Workspace ให้ลบ Project ทั้งหมดข้างในด้วย

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
