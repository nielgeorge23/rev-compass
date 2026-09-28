import { NextResponse, type NextRequest } from 'next/server'
import { isValidSession, SESSION_COOKIE } from '@/lib/auth/config'

const PUBLIC_PATHS = ['/login', '/problem-intro.html', '/architecture.html']
const PUBLIC_PATH_PREFIXES = ['/api/auth/', '/assets/', '/_next/']

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (isPublicPath(pathname)) return NextResponse.next()

  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (isValidSession(session)) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', pathname + search)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|assets/).*)'],
}
