import { NextRequest,NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const body = await req.json();
    const { first_name, last_name, birthdate, sex, occupation } = body;

    await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, birthdate = $3, sex = $4, occupation = $5 
       WHERE id = $6`,
      [first_name, last_name, birthdate, sex, occupation, decoded.userId]
    );
    
    const result = await pool.query(
      `SELECT id, email, first_name, last_name FROM users WHERE id = $1`,
      [decoded.userId]
    );
    const updatedUser = result.rows[0];


    const newToken = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );


    return NextResponse.json({ message: 'Profile updated successfully',
      token: newToken , });
  
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
