import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import partidosData from '../../../lib/data/partidos.json';

const partidosFilePath = path.resolve(process.cwd(), 'src/lib/data/partidos.json');

export const POST: APIRoute = async ({ request }) => {
  try {
    const partidoData = await request.json();
    
    // Use imported data for reading
    let partidos = [...partidosData];
    
    // Generar nuevo ID
    const maxId = Math.max(...partidos.map((p: any) => parseInt(p.id) || 0), 0);
    const nuevoPartido = {
      id: (maxId + 1).toString(),
      ...partidoData,
      fechaCreacion: new Date().toISOString(),
      estado: 'programado'
    };
    
    // Agregar nuevo partido
    partidos.push(nuevoPartido);
    
    // Guardar archivo
    await fs.writeFile(partidosFilePath, JSON.stringify(partidos, null, 2));
    
    return new Response(JSON.stringify({ 
      success: true, 
      partido: nuevoPartido 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creando partido:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
