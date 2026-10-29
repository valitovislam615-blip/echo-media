export default function Sidebar({ categories = [], tags = [], selectedCategory, setSelectedCategory, selectedTag, setSelectedTag, user, setShowCatModal }) {
  return (
    <aside style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', height: 'fit-content', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#cbd5e1' }}>Категории</h3>
        {user.role === 'admin' && (
          <button onClick={() => setShowCatModal(true)} style={{ backgroundColor: '#0369a1', color: '#fff', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
        )}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
        <li style={{ marginBottom: '8px' }}>
          <span onClick={() => setSelectedCategory(null)} style={{ display: 'block', padding: '8px 12px', backgroundColor: selectedCategory === null ? '#0369a1' : '#0f172a', borderRadius: '6px', fontSize: '14px', color: '#f8fafc', cursor: 'pointer' }}>🔥 Все публикации</span>
        </li>
        {categories && categories.map(cat => (
          <li key={cat.id} style={{ marginBottom: '8px' }}>
            <span onClick={() => setSelectedCategory(cat.id)} style={{ display: 'block', padding: '8px 12px', backgroundColor: selectedCategory === cat.id ? '#0369a1' : '#0f172a', borderRadius: '6px', fontSize: '14px', color: '#38bdf8', cursor: 'pointer' }}>📁 {cat.name}</span>
          </li>
        ))}
      </ul>

      <h3 style={{ fontSize: '16px', color: '#cbd5e1', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '15px' }}>Теги</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <span onClick={() => setSelectedTag(null)} style={{ padding: '4px 8px', backgroundColor: selectedTag === null ? '#0284c7' : '#0f172a', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', color: '#fff' }}>Все</span>
        {tags && tags.map(tag => (
          <span key={tag.id} onClick={() => setSelectedTag(tag.id)} style={{ padding: '4px 8px', backgroundColor: selectedTag === tag.id ? '#0284c7' : '#0f172a', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', color: '#38bdf8' }}>#{tag.name}</span>
        ))}
      </div>
    </aside>
  );
}