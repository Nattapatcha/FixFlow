<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        return [
            'name' => $name,
            'key' => strtoupper(substr($name, 0, 3)), // สุ่มอักษร 3 ตัวแรกเป็น Key
            'description' => $this->faker->paragraph(),
            'workspace_id' => \App\Models\Workspace::factory(),
        ];
    }
}
