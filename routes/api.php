<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CategoryController;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('feedbacks', FeedbackController::class)->only(['index', 'store', 'show']);
    Route::apiResource('feedbacks.comments', CommentController::class)->only(['store']);
});
Route::group(['prefix' => 'sanctum'], function() {
    Route::get('/csrf-cookie', function (\Illuminate\Http\Request $request) {
        return response()->noContent();
    });
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);



Route::get('/categories', [CategoryController::class, 'index']);

