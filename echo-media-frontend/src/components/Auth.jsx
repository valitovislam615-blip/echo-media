import React, { useState } from 'react';

export default function Auth({ 
  authTab, setAuthTab, authError, setAuthError,
  handleLogin, handleRegister,
  loginEmail, setLoginEmail, loginPassword, setLoginPassword,
  registerName, setRegisterName, registerEmail, setRegisterEmail, registerPassword, setRegisterPassword,
  setUser 
}) {
  const [isGoogleView, setIsGoogleView] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    if (!googleEmail) return;

    // Авторизуем пользователя на сайте под введенной почтой
    setUser({
      id: 999,
      name: googleEmail.split('@')[0] || 'Ислам Валитов',
      email: googleEmail,
      role: 'user'
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      <div style={{ backgroundColor: '#131b2e', border: '1px solid #1e293b', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', color: '#f8fafc' }}>
        
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', color: '#38bdf8', marginBottom: '6px' }}>Echo Media</h1>
        <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '20px' }}>
          {isGoogleView ? 'Вход в аккаунт Google' : 'Требуется авторизация в системе'}
        </p>

        {isGoogleView ? (
          /* ЭКРАН ВХОДА ЧЕРЕЗ GOOGLE */
          <form onSubmit={handleGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <span style={{ display: 'inline-block', padding: '8px', backgroundColor: '#ffffff', borderRadius: '50%', marginBottom: '6px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.21 21.34 7.28 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.08-3.16z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.21 2.66 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Войдите в аккаунт</h3>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Телефон или эл. адрес</label>
              <input 
                type="text" 
                required
                placeholder="valitovislam615@gmail.com"
                value={googleEmail} 
                onChange={e => setGoogleEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0b101d', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Введите пароль</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={googlePassword} 
                onChange={e => setGooglePassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0b101d', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit"
              style={{ width: '100%', backgroundColor: '#1a73e8', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginTop: '6px' }}
            >
              Далее
            </button>

            <button 
              type="button"
              onClick={() => setIsGoogleView(false)}
              style={{ width: '100%', backgroundColor: 'transparent', color: '#94a3b8', border: 'none', padding: '8px', fontSize: '13px', cursor: 'pointer' }}
            >
              ← Назад к сайту
            </button>
          </form>
        ) : (
          /* ОБЫЧНЫЙ ЭКРАН ВХОДА И РЕГИСТРАЦИИ */
          <>
            <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #1e293b' }}>
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                style={{ flex: 1, padding: '8px', background: 'none', border: 'none', borderBottom: authTab === 'login' ? '2px solid #38bdf8' : 'none', color: authTab === 'login' ? '#38bdf8' : '#94a3b8', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setAuthError(''); }}
                style={{ flex: 1, padding: '8px', background: 'none', border: 'none', borderBottom: authTab === 'register' ? '2px solid #38bdf8' : 'none', color: authTab === 'register' ? '#38bdf8' : '#94a3b8', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Регистрация
              </button>
            </div>

            {authError && (
              <div style={{ backgroundColor: 'rgba(153, 27, 27, 0.3)', border: '1px solid rgba(153, 27, 27, 0.5)', color: '#fca5a5', padding: '8px', borderRadius: '8px', marginBottom: '12px', fontSize: '12px', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            {authTab === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email</label>
                  <input 
                    type="text" 
                    required
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#0b101d', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Пароль</label>
                  <input 
                    type="password" 
                    required
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#0b101d', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}
                >
                  Войти
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Ваше имя</label>
                  <input 
                    type="text" 
                    required
                    value={registerName} 
                    onChange={e => setRegisterName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#0b101d', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email</label>
                  <input 
                    type="email" 
                    required
                    value={registerEmail} 
                    onChange={e => setRegisterEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#0b101d', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Пароль (мин. 6 символов)</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    value={registerPassword} 
                    onChange={e => setRegisterPassword(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#0b101d', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}
                >
                  Зарегистрироваться
                </button>
              </form>
            )}

            {/* Разделитель */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#64748b', fontSize: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }}></div>
              <span style={{ padding: '0 8px' }}>или</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1e293b' }}></div>
            </div>

            {/* Кнопка входа через Google */}
            <button
              type="button"
              onClick={() => setIsGoogleView(true)}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                border: '1px solid #cbd5e1',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.21 21.34 7.28 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.08-3.16z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.21 2.66 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              Войти через Google
            </button>
          </>
        )}

      </div>
    </div>
  );
}