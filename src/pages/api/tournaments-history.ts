import type { APIRoute } from 'astro';

// Datos mock simplificados para historial de torneos finalizados
const mockHistory = [
  {
    id: 'copa-litoral-2025',
    titulo: 'Copa Litoral 2025',
    anio: 2025,
    lugar: 'Club de Tenis Montemar, San Antonio',
    fechas: '28 mayo - 15 junio 2025',
    estado: 'finalizado',
    categorias: [
      {
        nombre: '1ª Categoría',
        totalJugadores: 12,
        campeon: {
          nombre: 'Cristian Ramírez',
          club: 'Club Montemar',
          partidosGanados: 4,
          setsGanados: 8,
          juegosGanados: 48
        },
        finalista: {
          nombre: 'Elías Muñoz',
          club: 'Club Montemar',
          partidosGanados: 3,
          setsGanados: 6,
          juegosGanados: 42
        }
      },
      {
        nombre: '2ª Categoría',
        totalJugadores: 12,
        campeon: {
          nombre: 'Roberto Castro',
          club: 'Club Valparaíso',
          partidosGanados: 4,
          setsGanados: 8,
          juegosGanados: 45
        },
        finalista: {
          nombre: 'María Rodríguez',
          club: 'Club Viña del Mar',
          partidosGanados: 3,
          setsGanados: 6,
          juegosGanados: 40
        }
      }
    ]
  }
];

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: true,
    data: mockHistory
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    }
  });
};
