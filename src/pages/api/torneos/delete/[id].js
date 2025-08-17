import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE({ params }) {
  try {
    const { id } = params;
    const dataFilePath = path.resolve(process.cwd(), 'src/lib/data/torneos.json');
    
    // Read current tournaments
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const tournaments = JSON.parse(fileContent);
    
    // Find tournament index
    const tournamentIndex = tournaments.findIndex(t => t.id === id);
    
    if (tournamentIndex === -1) {
      return new Response(JSON.stringify({ error: 'Torneo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Remove tournament
    tournaments.splice(tournamentIndex, 1);
    
    // Save updated tournaments
    await fs.writeFile(dataFilePath, JSON.stringify(tournaments, null, 2));
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
