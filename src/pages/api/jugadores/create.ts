import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.resolve(process.cwd(), 'src/data/players.json');

export const POST: APIRoute = async ({ request }) => {
  try {
    const newPlayer = await request.json();
    
    // Read existing data
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const players = JSON.parse(fileContent);
    
    // Add new player
    players.push(newPlayer);
    
    // Write updated data
    await fs.writeFile(dataFilePath, JSON.stringify(players, null, 2));
    
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