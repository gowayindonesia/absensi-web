'use client';
import { useState } from 'react';
import { useGeolocated } from 'react-geolocated';

export default function EmployeePage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const { coords } = useGeolocated({ enableHighAccuracy: true });

  const takePhoto = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'camera';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPhoto(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleCheck = async (type: 'check_in' | 'check_out') => {
    if (!coords) return setMessage('Aktifkan lokasi dulu di browser');
    if (!photo) return setMessage('Ambil foto dulu');
    const base64 = photo.split(',')[1];

    setMessage('Mengirim...');
    try {
      const res = await fetch('/api/attendance/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'demo-user',
          type,
          lat: coords.latitude,
          lng: coords.longitude,
          photo_base64: base64,
        }),
      });

      const json = await res.json();
      if (json.ok) setMessage(`✅ ${type} berhasil! Jarak ${json.distance_m?.toFixed(2)}m`);
      else setMessage(`❌ ${json.error || 'Gagal'}`);
    } catch (e) {
      setMessage('❌ Terjadi error saat mengirim');
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Absensi Online</h1>
      <p>Halaman sederhana untuk demo absensi web (lokasi + foto)</p>

      <div style={{ marginTop: 16 }}>
        <button onClick={takePhoto} style={{ padding: '8px 12px', borderRadius: 6 }}>📸 Ambil Foto</button>
      </div>

      {photo && (
        <div style={{ marginTop: 12 }}>
          <img src={photo} alt="preview" style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8 }} />
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={() => handleCheck('check_in')} style={{ padding: '8px 12px', borderRadius: 6, background: '#16a34a', color: '#fff' }}>Check In</button>
        <button onClick={() => handleCheck('check_out')} style={{ padding: '8px 12px', borderRadius: 6, background: '#dc2626', color: '#fff' }}>Check Out</button>
      </div>

      <div style={{ marginTop: 12, color: '#374151' }}>{message}</div>
    </div>
  );
}
