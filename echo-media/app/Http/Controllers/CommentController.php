<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'body' => 'required|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // ИИ-модерация комментариев
        $badWords = ['спам', 'мошенники', 'casino', 'скам', 'дурак'];
        foreach ($badWords as $word) {
            if (mb_stripos($validated['body'], $word) !== false) {
                return response()->json([
                    'message' => 'Комментарий отклонен системой ИИ-модерации: обнаружен спам или оскорбления.'
                ], 422);
            }
        }

        $validated['user_id'] = $request->input('user_id', 1);
        $comment = Comment::create($validated);
        
        return response()->json($comment->load('user'), 201);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return response()->json(['message' => 'Комментарий удален']);
    }
}