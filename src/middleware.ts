//arquivo de middleware para proteção de rotas evitando que qualquer cabaço não consiga acessar as rotas protegidas
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  //routes protegidas
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/badges') || 
    pathname.startsWith('/ranking') || 
    pathname.startsWith('/history') || 
    pathname.startsWith('/settings');
  
  //routes de auth
  const isAuthRoute = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/register');
  
  //verificar token de autenticação - se possível já colocar o openssl rand -base64 32 para gerar o token do nextauth_secret nessa merda
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  //se for uma rota protegida e não estiver autenticado, redirecionar para login
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  //caminho inverso do que o de cima
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  //caminho inverso do que o de cima
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

//configurar quais rotas o middleware deve rodar
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/badges/:path*',
    '/ranking/:path*',
    '/history/:path*',
    '/settings/:path*',
  ],
}; 