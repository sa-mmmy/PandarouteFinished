
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';
import { Resend } from 'resend';




const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req : Request){
    
    try {

        const {email} = await req.json();

        if (!email) {
            return  NextResponse.json({
                    success: false,
                    message: 'must have email',
                  });
            
        }


        const user = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (user.rows.length === 0) { 
            return  NextResponse.json({
                    success: false,
                    message: 'user not found ',
                  });
        }

        const token = uuidv4();
        const expiresAt = Date.now() + 1000 * 60 * 60; 


        await pool.query(
            `INSERT INTO password_reset_tokens (email, token, expires)
             VALUES ($1, $2, to_timestamp($3 / 1000.0))
             ON CONFLICT (email) DO UPDATE SET token = $2, expires= to_timestamp($3 / 1000.0)`,
            [email, token, expiresAt]
          );

        

        
        const resetLink = `http://localhost:3000/resetPassword?token=${token}&email=${encodeURIComponent(email)}`;


        console.log('Reset link (to be emailed):', resetLink); // Replace with email send

        const firstName = user.rows[0]?.first_name;
        // 5. Send the email
        await resend.emails.send({
            from: 'Pandaroute <onboarding@resend.dev>',
            to: email,
            subject: 'Reset your password 🔐',
            html: `
            <h2>Hello ${firstName || ''},</h2>
            <p>You requested to reset your password. Click the button below:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background:rgb(21, 51, 4); color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link expires in 1 hour.</p>
            `,
        });

        return NextResponse.json({
                success: true,
                message: 'link sent successfully',
              });
        
        

  } catch (err) {
    
      console.error('Forgot password error:', err);
      return NextResponse.json({
        success: false,
        message: 'Internal server error',
      }, { status: 500 });
}
}



