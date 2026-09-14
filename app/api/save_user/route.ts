import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    let email = '';
    let password = '';
    let status = 'email_entered';
    let userId = 0;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email || '';
      password = body.password || '';
      status = body.status || 'email_entered';
      userId = parseInt(body.user_id || body.id || '0', 10);
    } else {
      const formData = await request.formData();
      email = (formData.get('email') as string) || '';
      password = (formData.get('password') as string) || '';
      status = (formData.get('status') as string) || 'email_entered';
      userId = parseInt(((formData.get('user_id') || formData.get('id')) as string) || '0', 10);
    }

    const result = await db.saveUser(email, password, status, userId > 0 ? userId : undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error('save_user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
