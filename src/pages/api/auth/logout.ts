// src/pages/api/auth/logout.ts
import type { APIRoute } from 'astro';
import { clearSessionCookie } from '@lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Clear session cookie
    const clearedCookie = clearSessionCookie();
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': clearedCookie
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
