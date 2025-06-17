import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, senderEmail, section } = await req.json();

    // Basic validation
    if (!message || !senderEmail || !section) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Construct email using Resend
    const emailData = {
      from: 'AI Stylist <notifications@aistylist.at>',
      to: 'hulanraphael@gmail.com',
      subject: `New Message from ${section}`,
      text: `Message from: ${senderEmail}\n\n${message}`,
      html: `
        <h2>New message from ${section}</h2>
        <p><strong>From:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email using fetch to Email API (you can use any email service)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 