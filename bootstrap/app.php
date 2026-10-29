<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Validation\ValidationException;
use App\Http\Middleware\EnsureUserHasRole; // <--- 1. Импортируем мидлвар


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 2. Регистрируем псевдоним 'role'
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                    return response()->json([
                        'message' => 'Запрашиваемый ресурс не найден'
                    ], 404);
                }

                if ($e instanceof ValidationException) {
                    return response()->json([
                        'message' => 'Ошибка валидации',
                        'errors'  => $e->errors()
                    ], 422);
                }

                if ($e->getCode() === '23000') {
                    return response()->json([
                        'message' => 'Невозможно удалить ресурс, так как на него ссылаются другие данные'
                    ], 409);
                }

                return response()->json([
                    'message' => config('app.debug') ? $e->getMessage() : 'Внутренняя ошибка сервера'
                ], 500);
            }
        });
    })->create();