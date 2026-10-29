import React, { useState } from 'react';

export default function PostList({ 
  filteredPosts, 
  user, 
  handleDeletePost, 
  handleDeleteComment, 
  activePostComments, 
  setActivePostComments, 
  commentTexts, 
  setCommentTexts, 
  handleAddComment 
}) {
  const [likes, setLikes] = useState({});

  const toggleLike = async (postId) => {
    const userId = user?.id || 1;

    // Мгновенное переключение интерфейса
    setLikes(prev => {
      const current = prev[postId] || { 
        liked: filteredPosts.find(p => p.id === postId)?.is_liked || false, 
        count: filteredPosts.find(p => p.id === postId)?.likes_count || 0 
      };
      
      const nextLiked = !current.liked;
      return {
        ...prev,
        [postId]: {
          liked: nextLiked,
          count: nextLiked ? current.count + 1 : Math.max(0, current.count - 1)
        }
      };
    });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/likes/toggle', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          post_id: Number(postId), 
          user_id: Number(userId) 
        })
      });

      const data = await res.json();
      
      if (res.ok && data) {
        setLikes(prev => ({
          ...prev,
          [postId]: {
            liked: data.status === 'liked',
            count: data.likes_count ?? prev[postId].count
          }
        }));
      }
    } catch (err) {
      console.error('Ошибка лайка:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {filteredPosts.length === 0 ? (
        <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', padding: '30px', borderRadius: '16px', textAlign: 'center', color: '#94a3b8' }}>
          Публикации не найдены
        </div>
      ) : (
        filteredPosts.map(post => {
          const currentLike = likes[post.id] !== undefined ? likes[post.id] : {
            liked: post.is_liked || false,
            count: post.likes_count || 0
          };

          const isOpen = activePostComments === post.id;

          return (
            <div key={post.id} style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', color: '#f8fafc' }}>
              
              {/* Шапка поста */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ backgroundColor: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                  {post.category?.name || 'Технологии'}
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Автор: {post.user?.name || 'Администратор'}
                  </span>
                  {user?.role === 'admin' && handleDeletePost && (
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      style={{ backgroundColor: 'rgba(153, 27, 27, 0.8)', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.5)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>

              {/* Заголовок и текст */}
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>{post.title}</h3>
              <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '20px' }}>{post.content}</p>

              {/* Панель взаимодействия */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
                
                {/* Кнопка лайка в стиле красной кнопки удаления */}
                <button
                  onClick={() => toggleLike(post.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: currentLike.liked ? 'rgba(153, 27, 27, 0.8)' : '#0b101d',
                    border: `1px solid ${currentLike.liked ? 'rgba(239, 68, 68, 0.5)' : '#1e293b'}`,
                    color: currentLike.liked ? '#fff' : '#94a3b8',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{currentLike.liked ? '❤️' : '🤍'}</span>
                  <span>{currentLike.count} Лайков</span>
                  {currentLike.liked && <span style={{ fontSize: '11px', marginLeft: '4px', opacity: 0.8 }}>(Убрать)</span>}
                </button>

                {/* Кнопка комментариев */}
                <button
                  onClick={() => setActivePostComments(isOpen ? null : post.id)}
                  style={{
                    backgroundColor: '#0b101d',
                    border: '1px solid #1e293b',
                    color: '#38bdf8',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  💬 Комментариев: {post.comments?.length || 0}
                </button>

              </div>

              {/* Секция комментариев */}
              {isOpen && (
                <div style={{ marginTop: '16px', borderTop: '1px dashed #1e293b', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {(!post.comments || post.comments.length === 0) ? (
                      <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Пока нет комментариев.</p>
                    ) : (
                      post.comments.map(comment => (
                        <div key={comment.id} style={{ backgroundColor: '#0b101d', padding: '10px 14px', borderRadius: '10px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                              {comment.user?.name || 'Пользователь'}
                            </span>
                            <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{comment.body}</span>
                          </div>
                          {(user?.role === 'admin' || comment.user_id === user?.id) && handleDeleteComment && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              style={{ backgroundColor: 'rgba(153, 27, 27, 0.8)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                            >
                              ✕ Удалить
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={(e) => handleAddComment(post.id, e)} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text"
                      placeholder="Написать комментарий..."
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                      style={{ flex: 1, backgroundColor: '#0b101d', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}
                    />
                    <button 
                      type="submit"
                      style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Отправить
                    </button>
                  </form>
                </div>
              )}

            </div>
          );
        })
      )}
    </div>
  );
}