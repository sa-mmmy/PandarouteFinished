import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, firstName } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'Pandaroute <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Pandaroute App 🎉',
      html: `<strong>Hey ${firstName},</strong><br />Thanks for signing up! We're happy to have you onboard 🚀`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
