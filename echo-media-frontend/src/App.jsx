import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostList from './components/PostList';
import PostModal from './components/PostModal';
import CategoryModal from './components/CategoryModal';

function App() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null); 
  const [authTab, setAuthTab] = useState('login'); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Состояния для работы с комментариями
  const [commentTexts, setCommentTexts] = useState({});
  const [activePostComments, setActivePostComments] = useState(null);

  const handleToggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUser({
      ...user,
      id: user.id || 1, 
      role: newRole
    });
  };

  const handleGoogleLogin = (email) => {
    setUser({
      id: 999,
      name: email ? email.split('@')[0] : 'Ислам Валитов',
      email: email || 'valitovislam615@gmail.com',
      role: 'user'
    });
  };

  const fetchData = () => {
    let url = 'http://127.0.0.1:8000/api/posts?';
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (selectedTag) url += `tag_id=${selectedTag}&`;
    if (user?.id) url += `user_id=${user.id}&`;

    Promise.all([
      fetch('http://127.0.0.1:8000/api/categories').then(res => res.json()).catch(() => []),
      fetch('http://127.0.0.1:8000/api/tags').then(res => res.json()).catch(() => []),
      fetch(url).then(res => res.json()).catch(() => [])
    ])
      .then(([catData, tagData, postData]) => {
        setCategories(catData);
        setTags(tagData);
        setPosts(postData);
        if (catData.length > 0 && !categoryId) setCategoryId(catData[0].id);
        setLoading(false);
      })
      .catch(() => {
        setError('Не удалось подключиться к серверу бэкенда.');
        setLoading(false);
      });
  };

  useEffect(() => { if (user) fetchData(); }, [user, searchQuery, selectedTag]);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.success) {
          setUser({ ...data.user, id: data.user.id || 1 });
        } else {
          setAuthError(data.message || 'Ошибка входа');
        }
      })
      .catch(() => setAuthError('Ошибка соединения'));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: registerName, email: registerEmail, password: registerPassword })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.success) {
          setUser({ ...data.user, id: data.user.id || 1 });
        } else {
          setAuthError(data.message || 'Ошибка регистрации');
        }
      })
      .catch(() => setAuthError('Ошибка соединения'));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('user_id', Number(user?.id) || 1);
    formData.append('is_published', isPublished ? 1 : 0);
    if (imageFile) formData.append('image', imageFile);

    fetch('http://127.0.0.1:8000/api/posts', {
      method: 'POST',
      body: formData
    }).then(() => {
      setTitle(''); setContent(''); setImageFile(null); setShowPostModal(false); setSubmitting(false); fetchData();
    });
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName })
    }).then(() => { setNewCatName(''); setShowCatModal(false); fetchData(); });
  };

  const handleDeletePost = (id) => {
    if (confirm('Удалить пост?')) {
      fetch(`http://127.0.0.1:8000/api/posts/${id}`, { method: 'DELETE' }).then(() => fetchData());
    }
  };

  // ФУНКЦИЯ УДАЛЕНИЯ КОММЕНТАРИЯ
  const handleDeleteComment = (commentId) => {
    if (confirm('Удалить комментарий?')) {
      fetch(`http://127.0.0.1:8000/api/comments/${commentId}`, { method: 'DELETE' }).then(() => fetchData());
    }
  };

  // ФУНКЦИЯ ДОБАВЛЕНИЯ КОММЕНТАРИЯ
  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const body = commentTexts[postId];
    if (!body?.trim()) return;

    fetch('http://127.0.0.1:8000/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, body, user_id: Number(user?.id || 1) })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'Ошибка добавления комментария');
          return;
        }
        setCommentTexts(prev => ({ ...prev, [postId]: '' }));
        fetchData();
      });
  };

  const handleToggleLike = (postId) => {
    if (!user) return;

    fetch('http://127.0.0.1:8000/api/likes/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, user_id: Number(user.id || 1) })
    }).then(() => fetchData());
  };

  if (!user) {
    return (
      <Auth 
        authTab={authTab} setAuthTab={setAuthTab} authError={authError} setAuthError={setAuthError}
        handleLogin={handleLogin} handleRegister={handleRegister}
        loginEmail={loginEmail} setLoginEmail={setLoginEmail} loginPassword={loginPassword} setLoginPassword={setLoginPassword}
        registerName={registerName} setRegisterName={setRegisterName} registerEmail={registerEmail} setRegisterEmail={setRegisterEmail} registerPassword={registerPassword} setRegisterPassword={setRegisterPassword}
        setUser={setUser}
        handleGoogleLogin={handleGoogleLogin}
      />
    );
  }

  const filteredPosts = selectedCategory 
    ? posts.filter(p => p.category_id === selectedCategory) 
    : posts;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header 
        user={user} 
        setUser={setUser} 
        setShowPostModal={setShowPostModal} 
        setShowProfileModal={setShowProfileModal} 
        handleToggleRole={handleToggleRole}
      />

      <main style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="🔍 Поиск публикаций по ключевым словам..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {error && <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
        
        {loading ? <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px' }}>
            <Sidebar 
              categories={categories} tags={tags} 
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              selectedTag={selectedTag} setSelectedTag={setSelectedTag}
              user={user} setShowCatModal={setShowCatModal} 
            />
            <PostList 
              filteredPosts={filteredPosts} user={user}
              handleDeletePost={handleDeletePost} 
              handleDeleteComment={handleDeleteComment} 
              handleToggleLike={handleToggleLike}
              activePostComments={activePostComments} setActivePostComments={setActivePostComments}
              commentTexts={commentTexts} setCommentTexts={setCommentTexts} 
              handleAddComment={handleAddComment}
            />
          </div>
        )}
      </main>

      <PostModal 
        showPostModal={showPostModal} setShowPostModal={setShowPostModal} handleCreatePost={handleCreatePost}
        categoryId={categoryId} setCategoryId={setCategoryId} categories={categories}
        title={title} setTitle={setTitle} content={content} setContent={setContent} 
        isPublished={isPublished} setIsPublished={setIsPublished}
        setImageFile={setImageFile} submitting={submitting}
      />
      <CategoryModal 
        showCatModal={showCatModal} setShowCatModal={setShowCatModal} handleCreateCategory={handleCreateCategory}
        newCatName={newCatName} setNewCatName={setNewCatName}
      />

      {showProfileModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', color: '#f8fafc', position: 'relative' }}>
            
            <button 
              onClick={() => setShowProfileModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', color: '#94a3b8', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', color: '#38bdf8', marginBottom: '24px' }}>Данные аккаунта</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div style={{ backgroundColor: '#0b101d', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Имя пользователя:</span>
                <span style={{ fontWeight: '600', color: '#ffffff', fontSize: '16px' }}>{user?.name}</span>
              </div>

              <div style={{ backgroundColor: '#0b101d', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Email / Логин:</span>
                <span style={{ fontWeight: '600', color: '#ffffff', fontSize: '16px' }}>{user?.email}</span>
              </div>

              <div style={{ backgroundColor: '#0b101d', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Роль в системе:</span>
                <span style={{ fontWeight: '600', color: '#38bdf8', fontSize: '16px' }}>
                  {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowProfileModal(false)}
              style={{ width: '100%', marginTop: '24px', backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '600', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;