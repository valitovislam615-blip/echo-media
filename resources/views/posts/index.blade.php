<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Главная - Посты</title>
</head>
<body>
    <h1>Список постов</h1>
    @foreach($posts as $post)
        <div>
            <h3>{{ $post->title }}</h3>
            <p>{{ $post->content }}</p>
        </div>
    @endforeach
</body>
</html>