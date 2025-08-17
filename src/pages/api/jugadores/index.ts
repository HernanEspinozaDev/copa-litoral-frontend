import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import jugadoresData from '../../../lib/data/jugadores-completo.json';

const dataFilePath = path.resolve(process.cwd(), 'src/lib/data/jugadores-completo.json');

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const torneo = searchParams.get('torneo');
    const año = searchParams.get('año');
    const categoria = searchParams.get('categoria');
    interface Jugador {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
      telefono: string;
      fechaNacimiento: string;
      categoria: string;
      club: string;
      rut: string;
      torneoActual: string;
      año: number;
      estado: string;
      fechaInscripcion: string;
      grupo: string | null;
      posicion: number;
      puntos: number;
      partidosJugados: number;
      partidosGanados: number;
      partidosPerdidos: number;
      setsGanados: number;
      setsPerdidos: number;
      juegosGanados: number;
      juegosPerdidos: number;
    }
    
    let jugadores: any[] = [...jugadoresData];
    
    // Filtrar por torneo si se especifica
    if (torneo) {
      jugadores = jugadores.filter((j: any) => j.torneo === torneo || j.torneoActual === torneo);
    }
    
    // Filtrar por año si se especifica
    if (año) {
      jugadores = jugadores.filter((j: any) => j.año === parseInt(año));
    }
    
    // Filtrar por categoria si se especifica
    if (categoria) {
      jugadores = jugadores.filter((j: any) => j.categoria === categoria);
    }
    
    // Ordenar por año (descendente) y luego por torneo
    jugadores.sort((a: any, b: any) => {
      if (b.año !== a.año) {
        return b.año - a.año;
      }
      const torneoA = a.torneo || a.torneoActual || '';
      const torneoB = b.torneo || b.torneoActual || '';
      return torneoA.localeCompare(torneoB);
    });
    
    return new Response(JSON.stringify({ success: true, data: jugadores }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al leer jugadores' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
