import type { APIRoute } from 'astro';
import partidosData from '../../../../lib/data/partidos.json';
import jugadoresData from '../../../../lib/data/jugadores-completo.json';
import torneosData from '../../../../lib/data/torneos.json';

interface Match {
  id: number;
  torneo: string;
  categoria: string;
  año: number;
  fase: string;
  grupo?: string;
  jugador1: { id: number; nombre: string; club: string };
  jugador2: { id: number; nombre: string; club: string };
  fecha: string;
  resultado?: {
    sets: { jugador1: number; jugador2: number }[];
    ganador: number;
  };
}

interface Player {
  id: string;
  nombre: string;
  apellido: string;
  torneo: string;
  categoria: string;
  año: number;
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    // Find the tournament
    const torneo = torneosData.find(t => t.id === id);
    if (!torneo) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Tournament not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get matches for this tournament
    const partidosTorneo = (partidosData as Match[]).filter(p => 
      p.torneo === torneo.titulo && p.año === torneo.anio
    );

    // Get players for this tournament
    const jugadoresTorneo = (jugadoresData as Player[]).filter(j => 
      j.torneo === torneo.titulo && j.año === torneo.anio
    );

    // Organize by category
    const categorias: Record<string, any> = {};
    
    torneo.categorias.forEach(categoria => {
      const partidosCategoria = partidosTorneo.filter(p => p.categoria === categoria.nombre);
      const jugadoresCategoria = jugadoresTorneo.filter(j => j.categoria === categoria.nombre);
      
      // Organize matches by phase
      const fases = {
        grupos: partidosCategoria.filter(p => p.fase === 'grupos'),
        semifinales: partidosCategoria.filter(p => p.fase === 'semifinales'),
        final: partidosCategoria.filter(p => p.fase === 'final')
      };

      // Find winner and finalist
      const finalMatch = fases.final[0];
      let winner = null;
      let finalist = null;
      
      if (finalMatch && finalMatch.resultado && typeof finalMatch.resultado === 'object') {
        const ganadorId = finalMatch.resultado.ganador;
        winner = finalMatch.jugador1.id === ganadorId ? finalMatch.jugador1 : finalMatch.jugador2;
        finalist = finalMatch.jugador1.id === ganadorId ? finalMatch.jugador2 : finalMatch.jugador1;
      }

      // Build bracket structure
      const bracket = [];
      
      // Group stage
      if (fases.grupos.length > 0) {
        // Organize by groups
        const grupos: Record<string, any[]> = {};
        fases.grupos.forEach(partido => {
          const grupo = partido.grupo || 'A';
          if (!grupos[grupo]) grupos[grupo] = [];
          grupos[grupo].push({
            player1: partido.jugador1.nombre,
            player2: partido.jugador2.nombre,
            score: formatScore(partido.resultado),
            winner: getWinnerName(partido),
            fecha: partido.fecha
          });
        });

        Object.entries(grupos).forEach(([grupo, matches]) => {
          bracket.push({
            round: `Fase de Grupos - Grupo ${grupo}`,
            matches: matches
          });
        });
      }

      // Semifinals
      if (fases.semifinales.length > 0) {
        bracket.push({
          round: 'Semifinales',
          matches: fases.semifinales.map(partido => ({
            player1: partido.jugador1.nombre,
            player2: partido.jugador2.nombre,
            score: formatScore(partido.resultado),
            winner: getWinnerName(partido),
            fecha: partido.fecha
          }))
        });
      }

      // Final
      if (fases.final.length > 0) {
        bracket.push({
          round: 'Final',
          matches: fases.final.map(partido => ({
            player1: partido.jugador1.nombre,
            player2: partido.jugador2.nombre,
            score: formatScore(partido.resultado),
            winner: getWinnerName(partido),
            fecha: partido.fecha
          }))
        });
      }

      categorias[categoria.nombre] = {
        name: categoria.nombre,
        winner: winner?.nombre || null,
        finalist: finalist?.nombre || null,
        totalPlayers: jugadoresCategoria.length,
        totalMatches: partidosCategoria.length,
        bracket: bracket
      };
    });

    const response = {
      success: true,
      data: {
        tournament: {
          id: torneo.id,
          title: torneo.titulo,
          year: torneo.anio,
          status: torneo.estado,
          location: torneo.lugar,
          dates: torneo.fechas
        },
        categories: Object.values(categorias),
        stats: {
          totalCategories: torneo.categorias.length,
          totalMatches: partidosTorneo.length,
          totalPlayers: jugadoresTorneo.length,
          completed: torneo.estado === 'finalizado'
        }
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching tournament brackets:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function formatScore(resultado: any) {
  if (!resultado || typeof resultado !== 'object' || !resultado.sets) return 'Sin resultado';
  
  return resultado.sets.map((set: any) => 
    `${set.jugador1}-${set.jugador2}`
  ).join(', ');
}

function getWinnerName(partido: Match) {
  if (!partido.resultado || typeof partido.resultado !== 'object' || !partido.resultado.ganador) return null;
  
  const ganadorId = partido.resultado.ganador;
  return partido.jugador1.id === ganadorId ? 
    partido.jugador1.nombre : 
    partido.jugador2.nombre;
}
