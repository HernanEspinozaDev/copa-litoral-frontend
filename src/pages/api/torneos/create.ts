// src/pages/api/torneos/create.ts
import type { APIRoute } from 'astro';
import { createItem } from '@lib/database';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, date, location, description, categories, imageUrl } = await request.json();
    
    // Validate required fields
    if (!name || !date || !location || !description || !categories) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create new tournament
    const newTournament = {
      id: Date.now().toString(),
      name,
      date,
      location,
      description,
      categories,
      imageUrl
    };
    
    createItem('torneos.json', newTournament);
    
    return new Response(JSON.stringify({ success: true, tournament: newTournament }), {
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
