<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'required|exists:users,id',
        ]);

        // Проверяем, есть ли уже лайк от этого пользователя на этот пост
        $existingLike = Like::where('post_id', $request->post_id)
                            ->where('user_id', $request->user_id)
                            ->first();

        if ($existingLike) {
            // Если лайк уже есть — УДАЛЯЕМ ЕГО (снимаем лайк)
            $existingLike->delete();
            $status = 'unliked';
        } else {
            // Если лайка нет — СОЗДАЕМ ЕГО (ставим лайк)
            Like::create([
                'post_id' => $request->post_id,
                'user_id' => $request->user_id,
            ]);
            $status = 'liked';
        }

        // Считаем актуальное количество лайков для поста
        $likesCount = Like::where('post_id', $request->post_id)->count();

        return response()->json([
            'status' => $status,
            'likes_count' => $likesCount
        ]);
    }
}