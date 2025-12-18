import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { z } from 'zod';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Zod schema for signup
const SignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  sex: z.string(),
  birthdate: z.string(),
  occupation: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = SignupSchema.parse(body); 

    const {
      firstName,
      lastName,
      email,
      password,
      sex,
      birthdate,
      occupation,
    } = body;

    //  Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const result = await pool.query(
      `
      INSERT INTO users (first_name, last_name, email, password, sex, birthdate, occupation, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
      `,
      [firstName, lastName, email, hashedPassword, sex, birthdate, occupation]
    );



    const User = result.rows[0]; 

    const token = jwt.sign(
      { 
        userId: User.id,       // You use the actual value from the result rows
        email: User.email,     // Same here
        firstName: User.first_name,
        lastName: User.last_name
      }, 
      process.env.JWT_SECRET!,   // Secret key to sign the token
      { expiresIn: '1d' }        // Token expiration time (1 day in this case)
    );

    return NextResponse.json({ success: true, token , User });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: error.errors.map((e) => e.message).join(', ')
      });
    }

    console.error('Error inserting user:', error);
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
