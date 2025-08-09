// src/pages/api/partidos/create.ts
import type { APIRoute } from 'astro';
import { createItem } from '@lib/database';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { tournamentId, player1, player2, date, result } = await request.json();
    
    // Validate required fields
    if (!tournamentId || !player1 || !player2 || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create new match
    const newMatch = {
      id: Date.now().toString(),
      tournamentId,
      player1,
      player2,
      date,
      result: result || 'Pendiente'
    };
    
    createItem('partidos.json', newMatch);
    
    return new Response(JSON.stringify({ success: true, match: newMatch }), {
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
