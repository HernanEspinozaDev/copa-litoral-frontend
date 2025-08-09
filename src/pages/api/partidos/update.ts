// src/pages/api/partidos/update.ts
import type { APIRoute } from 'astro';
import { updateItem } from '@lib/database';

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const { tournamentId, player1, player2, date, result } = await request.json();
    
    // Validate required fields
    if (!id || !tournamentId || !player1 || !player2 || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update match
    const updatedMatch = {
      id,
      tournamentId,
      player1,
      player2,
      date,
      result: result || 'Pendiente'
    };
    
    const resultItem = updateItem('partidos.json', id, updatedMatch);
    
    if (!resultItem) {
      return new Response(JSON.stringify({ error: 'Match not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true, match: updatedMatch }), {
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
