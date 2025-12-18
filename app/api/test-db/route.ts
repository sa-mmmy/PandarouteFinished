import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, //  DB URL in .env
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM users LIMIT 1');
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}


