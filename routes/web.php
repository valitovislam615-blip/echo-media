<?php

use Illuminate\Support\Facades\Route;
use App\Models\Post;

// Главная страница: выводит список всех постов из базы данных с авторами и категориями
Route::get('/', function () {
    // Получаем все посты вместе с авторами и категориями
    $posts = Post::with(['user', 'category'])->latest()->get();

    // Возвращаем представление (шаблон) и передаем туда посты
    return view('posts.index', compact('posts'));
});