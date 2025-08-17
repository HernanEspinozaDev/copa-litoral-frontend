import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data/jugadores-completo.json');

async function readPlayersData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const newPlayer = await request.json();
    
    const players = await readPlayersData();
    
    // Generate new ID
    const maxId = Math.max(...players.map((p: any) => parseInt(p.id) || 0));
    newPlayer.id = (maxId + 1).toString();
    
    // Add new player
    players.push(newPlayer);
    
    // Write updated data
    await fs.writeFile(dataFilePath, JSON.stringify(players, null, 2));
    
    return new Response(JSON.stringify({ success: true, player: newPlayer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating player:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};