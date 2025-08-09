// src/pages/api/jugadores/create.ts
import type { APIRoute } from 'astro';
import { createItem } from '@lib/database';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, category } = await request.json();
    
    // Validate required fields
    if (!name || !email || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create new player
    const newPlayer = {
      id: Date.now().toString(),
      name,
      email,
      category
    };
    
    createItem('jugadores.json', newPlayer);
    
    return new Response(JSON.stringify({ success: true, player: newPlayer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
