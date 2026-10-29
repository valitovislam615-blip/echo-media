<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with('category', 'user', 'comments.user', 'tags', 'likes');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->has('tag_id') && !empty($request->tag_id)) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->where('tags.id', $request->tag_id);
            });
        }

        $posts = $query->latest()->get();

        // Получаем ID текущего пользователя (передаем из фронтенда или берем дефолтный 1)
        $userId = $request->input('user_id', 1);

        // Добавляем к каждому посту информацию о лайках, чтобы они не пропадали
        $posts->each(function($post) use ($userId) {
            $post->likes_count = $post->likes->count();
            $post->is_liked = $post->likes->where('user_id', (int)$userId)->isNotEmpty();
        });

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'user_id' => 'required|exists:users,id',
            'is_published' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $imagePath = Storage::url($path);
        }

        $post = Post::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category_id' => $validated['category_id'],
            'user_id' => $validated['user_id'],
            'is_published' => $request->input('is_published', true),
            'image' => $imagePath,
        ]);

        return response()->json($post->load('category', 'user', 'tags'), 201);
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(['message' => 'Пост успешно удален']);
    }
}