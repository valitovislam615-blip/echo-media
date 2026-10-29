<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\Authorizable; // если потребуется

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

        // Если пользователь авторизован, берем его ID, иначе дефолтный 1 для публичного просмотра
        $userId = $request->user() ? $request->user()->id : $request->input('user_id', 1);

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
            'is_published' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $imagePath = Storage::url($path);
        }

        // Автоматически привязываем пост к текущему авторизованному пользователю через Sanctum
        $post = Post::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category_id' => $validated['category_id'],
            'user_id' => $request->user()->id, // <--- Берётся из токена, а не из запроса!
            'is_published' => $request->input('is_published', true),
            'image' => $imagePath,
        ]);

        return response()->json($post->load('category', 'user', 'tags'), 201);
    }

    // Добавьте метод update, если его еще не было
    public function update(Request $request, Post $post)
    {
        // Проверка через PostPolicy (может ли пользователь редактировать этот пост)
        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'is_published' => 'boolean',
        ]);

        $post->update($validated);

        return response()->json($post->load('category', 'user', 'tags'));
    }

    public function destroy(Post $post)
    {
        // Проверка через PostPolicy (может ли пользователь удалить этот пост)
        $this->authorize('delete', $post);

        $post->delete();
        return response()->json(['message' => 'Пост успешно удален']);
    }
}