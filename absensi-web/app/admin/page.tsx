export default function AdminPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Admin - Absensi</h1>
      <p>Halaman admin minimal. Untuk melihat data dan foto, buka Supabase Table Editor:</p>
      <ul>
        <li>Masuk ke <strong>https://app.supabase.com</strong></li>
        <li>Pilih project kamu</li>
        <li>Menu <strong>Table Editor</strong> → pilih <strong>attendance_records</strong></li>
      </ul>
      <p style={{ marginTop: 12 }}>Nanti kita bisa kembangkan halaman admin (filter, peta, export CSV) sesuai kebutuhan.</p>
    </div>
  );
}
