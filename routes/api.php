<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\LikeController;

// Группировка маршрутов с версионированием (префикс v1)
Route::prefix('v1')->group(function () {
    
    // Авторизация
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Стандартные REST-ресурсы (автоматически создают index, store, show, update, destroy)
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('posts', PostController::class);

    // Комментарии (ограничиваем только создание и удаление, либо полный apiResource)
    Route::apiResource('comments', CommentController::class)->only(['store', 'destroy']);

    // Дополнительные эндпоинты
    Route::get('/tags', [TagController::class, 'index']);
    Route::post('/likes/toggle', [LikeController::class, 'toggle']);

});