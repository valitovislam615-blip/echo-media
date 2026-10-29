<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Регистрация нового пользователя в базе
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Регистрация успешна',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->email === 'admin' ? 'admin' : 'user'
            ]
        ], 201);
    }

    // Вход с проверкой в базе данных
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // Ищем пользователя по email (или по имени/логину если ввели admin)
        $user = User::where('email', $request->email)
                    ->orWhere('name', $request->email)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный логин или пароль'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->email === 'admin' || $user->name === 'admin' ? 'admin' : 'user'
            ]
        ]);
    }
}