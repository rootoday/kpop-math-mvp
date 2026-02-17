import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protected routes: redirect to login if not authenticated
    const protectedPaths = ['/dashboard', '/admin', '/learn']
    const protectedApiPaths = ['/api/progress', '/api/users', '/api/ai']

    const isProtectedPage = protectedPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
    )
    const isProtectedApi = protectedApiPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
    )

    if (!session && isProtectedPage) {
        const redirectUrl = new URL('/login', req.url)
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    if (!session && isProtectedApi) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    // Redirect authenticated users away from login/signup
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/learn/:path*',
        '/login',
        '/signup',
        '/api/progress/:path*',
        '/api/users/:path*',
        '/api/ai/:path*',
    ],
}
