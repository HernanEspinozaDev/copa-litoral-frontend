import type { APIRoute } from 'astro';
import partidosData from '../../../lib/data/partidos.json';

interface Partido {
  id: number;
  torneo: string;
  categoria?: string;
  año: number;
  fase: string;
  grupo?: string | null;
  jugador1: {
    id: number;
    nombre: string;
    club: string;
  };
  jugador2: {
    id: number;
    nombre: string;
    club: string;
  };
  fecha: string;
  hora: string;
  cancha: number;
  resultado: {
    setsJ1: number;
    setsJ2: number;
    juegosSet1J1: number;
    juegosSet1J2: number;
    juegosSet2J1: number;
    juegosSet2J2: number;
    juegosSet3J1?: number;
    juegosSet3J2?: number;
  };
  estado: string;
  ganador?: string;
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const torneo = searchParams.get('torneo');
    const año = searchParams.get('año');
    const fase = searchParams.get('fase');
    const grupo = searchParams.get('grupo');
    
    let partidos: any[] = partidosData;
    
    // Filtrar por torneo si se especifica
    if (torneo) {
      partidos = partidos.filter((p: any) => p.torneo === torneo);
    }
    
    // Filtrar por año si se especifica
    if (año) {
      partidos = partidos.filter((p: any) => p.año === parseInt(año));
    }
    
    // Filtrar por fase si se especifica
    if (fase) {
      partidos = partidos.filter((p: any) => p.fase === fase);
    }
    
    // Filtrar por grupo si se especifica
    if (grupo) {
      partidos = partidos.filter((p: any) => p.grupo === grupo);
    }
    
    // Ordenar por fecha y fase
    partidos.sort((a: any, b: any) => {
      // Primero por fecha
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      
      if (fechaA.getTime() !== fechaB.getTime()) {
        return fechaA.getTime() - fechaB.getTime();
      }
      
      // Luego por fase (grupos primero, luego eliminatorias)
      const ordenFases = ['grupos', 'octavos', 'cuartos', 'semifinal', 'final'];
      const indexA = ordenFases.indexOf(a.fase);
      const indexB = ordenFases.indexOf(b.fase);
      
      return indexA - indexB;
    });
    
    return new Response(JSON.stringify({ success: true, data: partidos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al leer partidos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
