// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Login request received');
    
    // Try to get the request data directly
    const data = await request.json().catch(async () => {
      const formData = await request.formData();
      return {
        username: formData.get('username'),
        password: formData.get('password')
      };
    });
    
    const username = data.username;
    const password = data.password;
    console.log('Credentials:', { username, password });
    
    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Hardcoded users data
    const users = [{"id":1,"username":"admin","password":"password","role":"admin"}];
    
    // Validate credentials
    const user = users.find((u: { username: string; password: string }) => u.username === username && u.password === password);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Set session cookie with SameSite attribute
    const sessionCookie = `session=${username}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;
    
    return new Response(JSON.stringify({ 
      success: true, 
      redirectTo: '/admin/dashboard',
      debug: { cookieSet: sessionCookie } 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
