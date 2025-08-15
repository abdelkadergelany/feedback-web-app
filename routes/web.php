<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Route::get('/', function () {
//     return Inertia::render('home');
// })->name('home');

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('feedback.index');
    }
    return Inertia::render('home');
})->name('home');

Route::get('/feedback', function () {
        return Inertia::render('Feedback/index');
    })->name('feedback.index');


Route::get('/feedback/createform', function () {
    return Inertia::render('Feedback/feedbackForm');
})->name('feedback.createform');

Route::get('/feedback/{id}', function ($id) {
    return Inertia::render('Feedback/feedbackDetail', ['id' => $id]);
})->name('feedback.detail');



// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
