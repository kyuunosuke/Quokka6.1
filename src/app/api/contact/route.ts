import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
New Contact Form Submission

From: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `.trim();

    // Send email using Supabase Edge Function or your email service
    // For now, we'll log it and return success
    // You can integrate with SendGrid, Resend, or other email services
    console.log("Contact form submission:", emailContent);

    // TODO: Integrate with your email service to send to hello@quokkamole.com
    // Example with fetch to an email service:
    // await fetch('your-email-service-endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: 'hello@quokkamole.com',
    //     from: email,
    //     subject: `Contact Form: ${subject}`,
    //     text: emailContent
    //   })
    // });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
