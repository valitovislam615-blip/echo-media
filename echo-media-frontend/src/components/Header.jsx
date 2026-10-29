export default function Header({ user, setUser, setShowPostModal, setShowProfileModal }) {
  const handleLogout = () => {
    setUser(null);
  };

  const handleToggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUser({
      ...user,
      role: newRole
    });
  };

  const userName = user?.name || 'Ислам';
  const userRole = user?.role === 'admin' ? 'Администратор' : 'Пользователь';

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: '#131b2e', 
      border: '1px solid #1e293b', 
      padding: '16px 24px', 
      borderRadius: '16px', 
      marginBottom: '24px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      color: '#f8fafc',
      flexWrap: 'wrap',
      gap: '15px'
    }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#38bdf8', margin: 0, letterSpacing: '0.5px' }}>
          Echo Media
        </h1>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
          Курсовой проект: Laravel REST API + React
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        
        <button 
          onClick={handleToggleRole}
          title="Нажмите, чтобы сменить роль"
          style={{ 
            backgroundColor: user?.role === 'admin' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(13, 148, 136, 0.2)', 
            color: user?.role === 'admin' ? '#fbbf24' : '#2dd4bf', 
            border: `1px solid ${user?.role === 'admin' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(13, 148, 136, 0.4)'}`, 
            padding: '7px 12px', 
            borderRadius: '10px', 
            fontWeight: '600', 
            fontSize: '12px', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🔄 Роль: {user?.role === 'admin' ? 'Админ' : 'Юзер'}
        </button>

        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowPostModal(true)}
            style={{ 
              backgroundColor: '#0284c7', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '10px', 
              fontWeight: '600', 
              fontSize: '13px', 
              cursor: 'pointer' 
            }}
          >
            + Пост
          </button>
        )}

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          backgroundColor: '#0b101d', 
          border: '1px solid #1e293b', 
          padding: '8px 14px', 
          borderRadius: '12px' 
        }}>
          
          <div 
            onClick={() => setShowProfileModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{ 
              width: '34px', 
              height: '34px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(147, 51, 234, 0.25)', 
              border: '1px solid rgba(147, 51, 234, 0.4)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#c084fc', 
              fontWeight: 'bold', 
              fontSize: '14px' 
            }}>
              {userName[0].toUpperCase()}
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc', display: 'block', lineHeight: '1.2' }}>
                {userName}
              </span>
              <span style={{ fontSize: '11px', color: '#38bdf8', display: 'block' }}>
                ({userRole})
              </span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: 'rgba(153, 27, 27, 0.85)', 
              color: '#fff', 
              border: 'none', 
              padding: '7px 14px', 
              borderRadius: '8px', 
              fontSize: '12px', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            Выйти
          </button>
        </div>

      </div>
    </div>
  );
}