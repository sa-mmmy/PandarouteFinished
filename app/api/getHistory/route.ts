import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      //console.log('No Authorization header found');
      //return NextResponse.json({ message: 'No token provided' }, { status: 401 });
      if (req.nextUrl.pathname === '/api/getHistory') {
             console.warn('No Authorization header for /api/getHistory');
            
      }

      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const result = await pool.query(
      'SELECT distance , duration , carbon_emissions, beginning, ending FROM trajectories WHERE user_id = $1',
      [decoded.userId]
    );



    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching History:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
