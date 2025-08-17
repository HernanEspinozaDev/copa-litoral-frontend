import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import jugadoresData from '../../../lib/data/jugadores-completo.json';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data/jugadores-completo.json');

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing player ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use imported data for reading
    let players = [...jugadoresData];

    // Filter out the player to delete
    const updatedPlayers = players.filter(p => p.id !== id);

    if (players.length === updatedPlayers.length) {
        return new Response(JSON.stringify({ error: 'Player not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Write updated data
    await fs.writeFile(dataFilePath, JSON.stringify(updatedPlayers, null, 2));

    return new Response(JSON.stringify({ success: true }), {
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