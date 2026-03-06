<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Workspace>
 */
class WorkspaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    
    public function definition(): array
    {
        
        return [
            'name' => $this->faker->company() . ' Workspace',
            // owner_id เราจะไปกำหนดใน Seeder หรือใช้การสุ่ม User ก็ได้
            'owner_id' => \App\Models\User::factory(),
        ];
    }
}
