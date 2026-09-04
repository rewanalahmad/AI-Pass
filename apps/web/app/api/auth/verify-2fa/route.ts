import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, method } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit authentication code.' }, { status: 400 });
    }

    if (code === '000000') {
      return NextResponse.json({ error: 'Invalid authentication code. Please check your verification code.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication successful.',
      method: method || 'email',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to verify 2FA code. Please try again.' }, { status: 500 });
  }
}
