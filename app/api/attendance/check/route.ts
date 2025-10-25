import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: Request) {
  try {
    const { user_id, type, lat, lng, photo_base64 } = await req.json();

    if (!user_id || !type || !lat || !lng || !photo_base64) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const fileName = `${user_id}-${Date.now()}.jpg`;
    const photoBuffer = Buffer.from(photo_base64, 'base64');
    const { error: uploadError } = await supabase.storage
      .from('attendance_photos')
      .upload(fileName, photoBuffer, { contentType: 'image/jpeg' });

    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 400 });

    const photo_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/attendance_photos/${fileName}`;

    const { data: locations } = await supabase.from('attendance_locations').select('*');
    let nearest: any = null;
    let inside = false;

    for (const loc of locations || []) {
      const dist = distanceMeters(lat, lng, loc.lat, loc.lng);
      if (!nearest || dist < nearest.dist) nearest = { ...loc, dist };
    }

    if (nearest && nearest.dist <= nearest.radius_meters) inside = true;

    const { error: insertError } = await supabase.from('attendance_records').insert({
      user_id,
      type,
      lat,
      lng,
      location_id: nearest?.id,
      inside_geofence: inside,
      photo_url,
    });

    if (insertError)
      return NextResponse.json({ error: insertError.message }, { status: 400 });

    return NextResponse.json({
      ok: true,
      inside,
      distance_m: nearest?.dist,
      photo_url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'error' }, { status: 500 });
  }
}
