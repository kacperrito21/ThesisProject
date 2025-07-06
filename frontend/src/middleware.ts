import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
})

export function middleware(request: NextRequest) {
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

  if (pathWithoutLocale === '/') {
    const url = request.nextUrl.clone()
    url.pathname = token ? `/${locale}/dashboard` : `/${locale}/login`
    return NextResponse.redirect(url)
  }

  if (!token && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  if (token && isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
