import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getUserByEmail, SESSION_COOKIE, toPublicUser } from '@/lib/auth/config'

export async function GET() {
  const session = (await cookies()).get(SESSION_COOKIE)?.value
  const user = getUserByEmail(session)

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user: toPublicUser(user) })
}
