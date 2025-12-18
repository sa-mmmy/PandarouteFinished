// app/api/resetPassword/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Get token entry from DB
    const result = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE email = $1 AND token = $2`,
      [email, token]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
    }

    const tokenData = result.rows[0];
    const now = Date.now();

    const expiresAt = new Date(tokenData.expires_at).getTime();

    if (now > expiresAt) {
      return NextResponse.json({ message: 'Reset token has expired' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await pool.query(
      `UPDATE users SET password = $1 WHERE email = $2`,
      [hashedPassword, email]
    );

    // Remove used token
    await pool.query(
      `DELETE FROM password_reset_tokens WHERE email = $1`,
      [email]
    );

    return NextResponse.json({ message: 'Password has been reset successfully' }, { status: 200 });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 });
  }
}
