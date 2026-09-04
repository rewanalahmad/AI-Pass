import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, lastName, email, origin, phone, password, confirmPassword } = body;

    const missingFields: string[] = [];
    if (!username?.trim()) missingFields.push('Name/Username');
    if (!lastName?.trim()) missingFields.push('Last Name');
    if (!email?.trim()) missingFields.push('Email');
    if (!origin?.trim()) missingFields.push('Country');
    if (!phone?.trim()) missingFields.push('Phone Number');
    if (!password) missingFields.push('Password');
    if (!confirmPassword) missingFields.push('Confirm Password');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `The following required fields are missing: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanPhone = phone?.replace(/^\+\d+\s*/, '').trim();
    if (!cleanPhone || !/^\d+$/.test(cleanPhone)) {
      return NextResponse.json({ error: 'Phone number must contain digits only.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Password and Confirm Password do not match.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please confirm your email address.',
      email: email.trim(),
    });
  } catch {
    return NextResponse.json({ error: 'An error occurred during registration. Please try again.' }, { status: 500 });
  }
}
