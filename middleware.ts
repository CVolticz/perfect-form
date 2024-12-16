//middleware to handle next auth session to render on every pages
export { default } from 'next-auth/middleware';

export const config = { 
    matcher: ['/teach', '/profile', '/protected/:path*']
}