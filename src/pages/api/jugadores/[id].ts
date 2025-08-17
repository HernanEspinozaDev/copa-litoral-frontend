import type { APIRoute } from 'astro';
import jugadoresData from '../../../lib/data/jugadores-completo.json';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.resolve('./src/lib/data/jugadores-completo.json');

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    const jugadores = jugadoresData;
    
    const jugador = jugadores.find((j: any) => j.id.toString() === id);
    
    if (!jugador) {
      return new Response(
        JSON.stringify({ success: false, error: 'Jugador no encontrado' }),
        { status: 404 }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, data: jugador }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error al obtener jugador:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al obtener jugador' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { id } = params;
  
  try {
    const updatedPlayer = await request.json();
    const jugadores = [...jugadoresData];
    
    const index = jugadores.findIndex((j: any) => j.id === id);
    
    if (index === -1) {
      return new Response(
        JSON.stringify({ success: false, error: 'Jugador no encontrado' }),
        { status: 404 }
      );
    }
    
    // Actualizar jugador manteniendo el ID
    jugadores[index] = { ...updatedPlayer, id };
    
    await fs.writeFile(dataFilePath, JSON.stringify(jugadores, null, 2));
    
    return new Response(
      JSON.stringify({ success: true, player: jugadores[index] }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error al actualizar jugador:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al actualizar jugador' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    const jugadores = [...jugadoresData];
    
    const filteredJugadores = jugadores.filter((j: any) => j.id !== id);
    
    if (jugadores.length === filteredJugadores.length) {
      return new Response(
        JSON.stringify({ success: false, error: 'Jugador no encontrado' }),
        { status: 404 }
      );
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(filteredJugadores, null, 2));
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al eliminar jugador' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
