import React from 'react';

export default function PostModal({
  showPostModal, setShowPostModal, handleCreatePost,
  categoryId, setCategoryId, categories,
  title, setTitle, content, setContent,
  isPublished, setIsPublished,
  setImageFile, submitting
}) {
  if (!showPostModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
      <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', width: '100%', maxWidth: '500px', padding: '24px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', color: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>Создать новую публикацию</h2>
          <button 
            type="button"
            onClick={() => setShowPostModal(false)}
            style={{ color: '#94a3b8', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Заголовок *</label>
            <input 
              type="text" 
              required
              placeholder="Введите заголовок статьи..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#0b101d', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Категория *</label>
            <select 
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', backgroundColor: '#0b101d', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            >
              <option value="">-- Выберите категорию --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Содержимое *</label>
            <textarea 
              required
              rows={4}
              placeholder="Текст публикации..."
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#0b101d', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Изображение (необязательно)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              style={{ width: '100%', padding: '8px', backgroundColor: '#0b101d', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              id="is_published" 
              checked={isPublished} 
              onChange={e => setIsPublished(e.target.checked)}
            />
            <label htmlFor="is_published" style={{ fontSize: '13px', color: '#cbd5e1', cursor: 'pointer' }}>Опубликовать сразу</label>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            style={{ width: '100%', backgroundColor: submitting ? '#64748b' : '#0284c7', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '10px' }}
          >
            {submitting ? 'Сохранение...' : 'Опубликовать'}
          </button>
        </form>
      </div>
    </div>
  );
}