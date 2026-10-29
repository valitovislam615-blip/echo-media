<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'content'     => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'tags'        => 'nullable|array',
            'tags.*'      => 'exists:tags,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Заголовок обязателен для заполнения',
            'content.required'     => 'Содержимое поста не может быть пустым',
            'category_id.required' => 'Категория обязательна',
            'category_id.exists'   => 'Указанная категория не существует',
            'tags.*.exists'        => 'Один или несколько выбранных тегов не существуют',
        ];
    }
}