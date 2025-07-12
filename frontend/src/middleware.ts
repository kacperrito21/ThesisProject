import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
})

async function isTokenValid(token: string, apiUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/auth/verify`, {
      method: 'GET',
      headers: {
        Cookie: `token=${token}`,
      },
    })
    return res.ok
  } catch (error) {
    throw new Error('Session expired, log in')
  }
}

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  const { pathname } = request.nextUrl
  const pathnameHasLocale = ['pl', 'en'].some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    return response
  }

  const locale = pathname.split('/')[1]
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
  const publicPaths = ['/login', '/register']
  const isPublicPath = publicPaths.includes(pathWithoutLocale)
  const token = request.cookies.get('token')?.value
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  if (pathWithoutLocale === '/') {
    if (token) {
      const isValid = await isTokenValid(token, apiUrl)
      const url = request.nextUrl.clone()
      url.pathname = isValid ? `/${locale}/dashboard` : `/${locale}/login`
      return NextResponse.redirect(url)
    } else {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      url.searchParams.set('error', 'session-expired')
      return NextResponse.redirect(url)
    }
  }

  if (!isPublicPath && token) {
    const isValid = await isTokenValid(token, apiUrl)
    if (!isValid) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      url.searchParams.set('error', 'session-expired')
      return NextResponse.redirect(url)
    }
  }

  if (!token && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  if (token && isPublicPath) {
    const isValid = await isTokenValid(token, apiUrl)
    if (isValid) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/dashboard`
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
