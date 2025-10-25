import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Parser } from 'json2csv';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') || '1970-01-01';
  const to = searchParams.get('to') || new Date().toISOString();

  const { data, error } = await supabase
    .from('attendance_records')
    .select('user_id,type,recorded_at,lat,lng,inside_geofence,photo_url')
    .gte('recorded_at', from)
    .lte('recorded_at', to);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const parser = new Parser();
  const csv = parser.parse(data || []);

  return new NextResponse(csv, {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=report.csv' },
  });
}
