<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Проверка: может ли пользователь обновить пост.
     */
    public function update(User $user, Post $post): bool
    {
        // Пользователь владелец поста ИЛИ его роль 'admin'
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    /**
     * Проверка: может ли пользователь удалить пост.
     */
    public function delete(User $user, Post $post): bool
    {
        // Пользователь владелец поста ИЛИ его роль 'admin'
        return $user->id === $post->user_id || $user->role === 'admin';
    }
}