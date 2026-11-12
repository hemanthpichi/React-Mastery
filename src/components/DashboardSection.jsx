export default function DashboardSection({ sectionTitle, children }) {
  return (
    <section style={{ marginTop: '30px', borderTop: '2px solid #333', paddingTop: '15px' }}>
      <h2 style={{ color: '#00adb5', marginBottom: '15px' }}>{sectionTitle}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {children}
      </div>
    </section>
  );
}
