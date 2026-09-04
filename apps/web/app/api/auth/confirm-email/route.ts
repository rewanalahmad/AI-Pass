import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit confirmation code.' }, { status: 400 });
    }

    if (code === '000000') {
      return NextResponse.json({ error: 'Invalid or expired confirmation code. Please try again or request a new code.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully.',
      email,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to verify code. Please try again.' }, { status: 500 });
  }
}
