<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Bug Report'],
            ['name' => 'Feature Request'],
            ['name' => 'Improvement'],
            ['name' => 'UI/UX'],
            ['name' => 'Other'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}