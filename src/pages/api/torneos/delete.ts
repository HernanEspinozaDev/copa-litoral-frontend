import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import torneosData from '../../../lib/data/torneos.json';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data/torneos.json');

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing tournament ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use imported data for reading
    let tournaments = [...torneosData];

    // Filter out the tournament to delete
    const updatedTournaments = tournaments.filter(t => t.id !== id);

    if (tournaments.length === updatedTournaments.length) {
        return new Response(JSON.stringify({ error: 'Tournament not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Write updated data
    await fs.writeFile(dataFilePath, JSON.stringify(updatedTournaments, null, 2));

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