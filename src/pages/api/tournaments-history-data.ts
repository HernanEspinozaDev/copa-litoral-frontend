import type { APIRoute } from 'astro';
import partidosData from '../../lib/data/partidos.json';
import jugadoresData from '../../lib/data/jugadores-completo.json';
import torneosData from '../../lib/data/torneos.json';

interface Match {
  id: number;
  torneo: string;
  categoria: string;
  año: number;
  fase: string;
  jugador1: { id: number; nombre: string; club: string };
  jugador2: { id: number; nombre: string; club: string };
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
  club: string;
  partidosJugados?: number;
  partidosGanados?: number;
  partidosPerdidos?: number;
}

export const GET: APIRoute = async () => {
  try {
    // Get only finished tournaments
    const torneosFinalizados = torneosData.filter(t => t.estado === 'finalizado');
    
    const historialData = torneosFinalizados.map(torneo => {
      // Get matches and players for this tournament
      const partidosTorneo = (partidosData as Match[]).filter(p => 
        p.torneo === torneo.titulo && p.año === torneo.anio
      );
      
      const jugadoresTorneo = (jugadoresData as Player[]).filter(j => 
        j.torneo === torneo.titulo && j.año === torneo.anio
      );

      // Process each category
      const categorias = torneo.categorias.map(categoria => {
        const partidosCategoria = partidosTorneo.filter(p => p.categoria === categoria.nombre);
        const jugadoresCategoria = jugadoresTorneo.filter(j => j.categoria === categoria.nombre);
        
        // Find final match
        const finalMatch = partidosCategoria.find(p => p.fase === 'final');
        let campeon = null;
        let finalista = null;
        
        if (finalMatch && finalMatch.resultado && typeof finalMatch.resultado === 'object') {
          const ganadorId = finalMatch.resultado.ganador;
          const ganador = finalMatch.jugador1.id === ganadorId ? finalMatch.jugador1 : finalMatch.jugador2;
          const perdedor = finalMatch.jugador1.id === ganadorId ? finalMatch.jugador2 : finalMatch.jugador1;
          
          // Find player details
          const jugadorGanador = jugadoresCategoria.find(j => parseInt(j.id) === ganador.id);
          const jugadorPerdedor = jugadoresCategoria.find(j => parseInt(j.id) === perdedor.id);
          
          if (jugadorGanador) {
            campeon = {
              nombre: `${jugadorGanador.nombre} ${jugadorGanador.apellido}`,
              club: jugadorGanador.club,
              partidosGanados: jugadorGanador.partidosGanados || 0,
              setsGanados: calculateSetsWon(partidosCategoria, ganador.id),
              juegosGanados: calculateGamesWon(partidosCategoria, ganador.id)
            };
          }
          
          if (jugadorPerdedor) {
            finalista = {
              nombre: `${jugadorPerdedor.nombre} ${jugadorPerdedor.apellido}`,
              club: jugadorPerdedor.club
            };
          }
        }
        
        // Find semifinalists
        const semifinalMatches = partidosCategoria.filter(p => p.fase === 'semifinales');
        const semifinalistas = [];
        
        semifinalMatches.forEach(match => {
          if (match.resultado && typeof match.resultado === 'object') {
            const perdedorId = match.resultado.ganador === match.jugador1.id ? match.jugador2.id : match.jugador1.id;
            const jugadorPerdedor = jugadoresCategoria.find(j => parseInt(j.id) === perdedorId);
            
            if (jugadorPerdedor && !semifinalistas.some(s => s.nombre === `${jugadorPerdedor.nombre} ${jugadorPerdedor.apellido}`)) {
              semifinalistas.push({
                nombre: `${jugadorPerdedor.nombre} ${jugadorPerdedor.apellido}`,
                club: jugadorPerdedor.club
              });
            }
          }
        });

        return {
          nombre: categoria.nombre,
          campeon,
          finalista,
          semifinalistas: semifinalistas.slice(0, 2) // Max 2 semifinalists
        };
      });

      // Calculate tournament statistics
      const totalJugadores = jugadoresTorneo.length;
      const totalPartidos = partidosTorneo.length;
      const clubesUnicos = [...new Set(jugadoresTorneo.map(j => j.club))];
      const totalClubes = clubesUnicos.length;
      
      // Calculate duration
      const fechaInicio = new Date(torneo.fechaInicio);
      const fechaFin = new Date(torneo.fechaFin);
      const duracionDias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      const duracion = `${duracionDias} días`;

      return {
        id: torneo.id,
        titulo: torneo.titulo,
        anio: torneo.anio,
        lugar: torneo.lugar,
        fechas: torneo.fechas,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        estado: torneo.estado,
        categorias,
        estadisticas: {
          totalJugadores,
          totalPartidos,
          totalClubes,
          duracion
        }
      };
    });

    // Sort by year (most recent first)
    historialData.sort((a, b) => b.anio - a.anio);

    return new Response(JSON.stringify({
      success: true,
      data: historialData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching tournament history:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function calculateSetsWon(matches: Match[], playerId: number): number {
  let setsWon = 0;
  
  matches.forEach(match => {
    if (match.resultado && typeof match.resultado === 'object' && match.resultado.sets) {
      const isPlayer1 = match.jugador1.id === playerId;
      
      match.resultado.sets.forEach(set => {
        if (isPlayer1 && set.jugador1 > set.jugador2) {
          setsWon++;
        } else if (!isPlayer1 && set.jugador2 > set.jugador1) {
          setsWon++;
        }
      });
    }
  });
  
  return setsWon;
}

function calculateGamesWon(matches: Match[], playerId: number): number {
  let gamesWon = 0;
  
  matches.forEach(match => {
    if (match.resultado && typeof match.resultado === 'object' && match.resultado.sets) {
      const isPlayer1 = match.jugador1.id === playerId;
      
      match.resultado.sets.forEach(set => {
        if (isPlayer1) {
          gamesWon += set.jugador1;
        } else {
          gamesWon += set.jugador2;
        }
      });
    }
  });
  
  return gamesWon;
}
