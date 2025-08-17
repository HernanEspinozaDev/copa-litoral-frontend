import type { APIRoute } from 'astro';
import jugadoresData from '../../lib/data/jugadores-completo.json';
import torneosData from '../../lib/data/torneos.json';

export const GET: APIRoute = async () => {
  try {
    const jugadores = jugadoresData;
    const torneos = torneosData;

    // Organize players by year, tournament, and category
    const jugadoresOrganizados: any = {};

    jugadores.forEach((jugador: any) => {
      const año = jugador.año;
      const torneo = jugador.torneo;
      const categoria = jugador.categoria;

      if (!jugadoresOrganizados[año]) {
        jugadoresOrganizados[año] = {};
      }

      if (!jugadoresOrganizados[año][torneo]) {
        jugadoresOrganizados[año][torneo] = {};
      }

      if (!jugadoresOrganizados[año][torneo][categoria]) {
        jugadoresOrganizados[año][torneo][categoria] = [];
      }

      jugadoresOrganizados[año][torneo][categoria].push(jugador);
    });

    // Add tournament metadata
    const resultado: any = {};
    Object.keys(jugadoresOrganizados).forEach(año => {
      resultado[año] = {};
      Object.keys(jugadoresOrganizados[año]).forEach(torneoNombre => {
        const torneo = torneos.find((t: any) => t.titulo === torneoNombre);
        resultado[año][torneoNombre] = {
          torneo: torneo || { titulo: torneoNombre },
          categorias: jugadoresOrganizados[año][torneoNombre]
        };
      });
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: resultado
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error al leer jugadores:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al obtener jugadores organizados'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
