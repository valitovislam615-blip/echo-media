export default function CategoryModal({ showCatModal, setShowCatModal, handleCreateCategory, newCatName, setNewCatName }) {
  if (!showCatModal) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', width: '400px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>Новая категория</h3>
        <form onSubmit={handleCreateCategory}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '5px' }}>Название</label>
            <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Название..." required style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowCatModal(false)} style={{ backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Отмена</button>
            <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Создать</button>
          </div>
        </form>
      </div>
    </div>
  );
}