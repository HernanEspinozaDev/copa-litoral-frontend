import type { APIRoute } from 'astro';
import players from '@data/players.json';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ success: true, data: players }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};