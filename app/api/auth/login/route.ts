import { NextResponse } from 'next/server'
import { authenticateUser, SESSION_COOKIE } from '@/lib/auth/config'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string
    password?: string
  } | null

  const email = body?.email?.trim().toLowerCase() ?? ''
  const password = body?.password ?? ''
  const user = authenticateUser(email, password)

  if (!user) {
    return NextResponse.json({ ok: false, error: 'Invalid email or password.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true, role: user.role })
  response.cookies.set(SESSION_COOKIE, user.email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
