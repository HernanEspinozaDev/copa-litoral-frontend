// src/pages/api/jugadores/update.ts
import type { APIRoute } from 'astro';
import { updateItem } from '@lib/database';

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const { name, email, category } = await request.json();
    
    // Validate required fields
    if (!id || !name || !email || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update player
    const updatedPlayer = {
      id,
      name,
      email,
      category
    };
    
    const result = updateItem('jugadores.json', id, updatedPlayer);
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Player not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true, player: updatedPlayer }), {
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
