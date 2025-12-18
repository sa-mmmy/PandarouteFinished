import { NextResponse } from "next/server";
import {Pool} from 'pg' ; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export async function POST(request : Request){

    try {

       const {email , password} = await request.json() 

       const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );


      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'User not found' });
      }

      


      const user = result.rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json({ success: false, error: 'Invalid password' });
      }

      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          firstName: user.first_name, 
          lastName: user.last_name 
        }, 
        process.env.JWT_SECRET!, 
        {
          expiresIn: '1d', 
        }
      );



      
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        //user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name },
      });


    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }


    
} 

