import type { APIRoute } from 'astro';

const mockTournaments = [
  {
    id: 'copa-litoral-2025',
    titulo: 'Copa Litoral 2025',
    anio: 2025,
    lugar: 'Club de Tenis Montemar, San Antonio',
    fechas: '28 mayo - 15 junio 2025',
    estado: 'finalizado',
    categorias: ['1ª Categoría', '2ª Categoría', '3ª Categoría', '4ª Categoría'],
    totalJugadores: 12,
    formato: 'Sistema de grupos + semifinales',
    precio: '$18.000 socios / $23.000 general',
    bases: 'BASES COPA LITORAL 2025\n\nFechas: 28 mayo - 15 junio 2025\nLugar: Club de Tenis Montemar, San Antonio\n\nCategorías: 1ª a 4ª Categoría (12 jugadores por categoría)\nFormato: Sistema de grupos y semifinales'
  }
];

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: true,
    data: mockTournaments
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    return new Response(JSON.stringify({
      success: true,
      data: body
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al procesar la solicitud'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
