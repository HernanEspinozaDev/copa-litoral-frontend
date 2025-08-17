import type { APIRoute } from 'astro';
import torneosData from '../../lib/data/torneos.json';

export const GET: APIRoute = async () => {
  try {
    return new Response(JSON.stringify(torneosData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al leer torneos:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al obtener torneos' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};