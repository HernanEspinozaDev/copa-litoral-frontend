import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const tournaments = [
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
      bases: 'BASES COPA LITORAL 2025\n\nFechas: 28 mayo - 15 junio 2025\nLugar: Club de Tenis Montemar, San Antonio\n\nCategorías: 1ª a 4ª Categoría (12 jugadores por categoría)\nFormato: Sistema de grupos y semifinales',
      precioSocios: '$18.000',
      precioGeneral: '$23.000',
      fechaLimiteInscripcion: '2025-05-25'
    }
  ];

  return new Response(JSON.stringify({
    success: true,
    data: tournaments
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300'
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    return new Response(JSON.stringify({
      success: true,
      data: body,
      message: 'Torneo creado exitosamente'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al procesar la solicitud',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
