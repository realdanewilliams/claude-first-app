import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Geography Guessing Game API is working',
    timestamp: new Date().toISOString()
  });
}