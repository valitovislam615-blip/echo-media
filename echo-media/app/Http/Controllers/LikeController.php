<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'required|exists:users,id',
        ]);

        // Ищем лайк, принадлежащий СТРОГО текущему пользователю на этот пост
        $existingLike = Like::where('post_id', $validated['post_id'])
                            ->where('user_id', $validated['user_id'])
                            ->first();

        if ($existingLike) {
            // Удаляем только если это лайк текущего пользователя
            $existingLike->delete();
            return response()->json(['liked' => false, 'message' => 'Лайк удален']);
        } else {
            // Иначе создаем новый лайк для этого пользователя
            Like::create($validated);
            return response()->json(['liked' => true, 'message' => 'Лайк добавлен'], 201);
        }
    }
}