import { env } from '@config/environment'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const hostname = req.headers.get('host')!.replace('.localhost:3000', `.${env.rootDomain}`)

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname
  console.log(path, path === '/test')

  // testing page
  // if (path === '/test') {
  //   return NextResponse.rewrite(new URL(`/test${path}`, req.url))
  // }

  // rewrites
  if (hostname == `app.${env.rootDomain}`) {
    return NextResponse.rewrite(new URL(`/app${path === '/' ? '' : path}`, req.url))
  }

  // rewrite root application to `/home` folder
  if (hostname === 'localhost:3000' || hostname === env.rootDomain) {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url))
  }

  // rewrite everything else to `/[domain]/[path] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url))
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}
