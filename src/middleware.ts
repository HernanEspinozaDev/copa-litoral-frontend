// src/middleware.ts
import { defineMiddleware } from 'astro/middleware';
import { getSessionUser } from '@lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  
  // Check if the request is for admin routes
  if (url.pathname.startsWith('/admin')) {
    console.log('Checking auth for admin route:', url.pathname);
    
    const sessionCookie = context.cookies.get('session');
    console.log('Session cookie:', sessionCookie?.value);
    
    const user = getSessionUser({
      get: (name) => context.cookies.get(name)?.value
    });
    console.log('User from session:', user);
    
    // If user is not authenticated, redirect to login
    if (!user) {
      console.log('No user found, redirecting to login');
      return context.redirect('/login');
    }
    
    console.log('User authenticated:', user);
  }
  
  return next();
});
