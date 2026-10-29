<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;

// Публичные маршруты (регистрация и вход)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Публичный просмотр каталога (доступен всем)
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('posts', PostController::class)->only(['index', 'show']);

// Защищенные маршруты (требуют Bearer токен Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Управление профилем и выход
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Создание/редактирование постов (для авторизованных)
    Route::apiResource('posts', PostController::class)->except(['index', 'show']);

    // Пример административного маршрута (доступ только с ролью 'admin')
    Route::get('/admin/stats', function () {
        return response()->json(['message' => 'Секретная статистика для администратора']);
    })->middleware('role:admin');
});