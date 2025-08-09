import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const tournamentsHistory = [
    {
      id: 'copa-litoral-2023',
      titulo: 'Copa Litoral 2023',
      anio: 2023,
      lugar: 'Club de Tenis Montemar, San Antonio',
      fechas: '15 mayo - 3 junio 2023',
      estado: 'finalizado',
      categorias: [
        {
          nombre: '1ª Categoría',
          campeon: { nombre: 'Felipe Rojas' },
          finalista: { nombre: 'Diego Soto' }
        },
        {
          nombre: '2ª Categoría',
          campeon: { nombre: 'Javier Morales' },
          finalista: { nombre: 'Simón Navarro' }
        },
        {
          nombre: '3ª Categoría',
          campeon: { nombre: 'Benjamín Herrera' },
          finalista: { nombre: 'Vicente Castillo' }
        }
      ]
    },
    {
      id: 'copa-litoral-2024',
      titulo: 'Copa Litoral 2024',
      anio: 2024,
      lugar: 'Club de Tenis Montemar, San Antonio',
      fechas: '20 mayo - 8 junio 2024',
      estado: 'finalizado',
      categorias: [
        {
          nombre: '1ª Categoría',
          campeon: { nombre: 'Martín Reyes' },
          finalista: { nombre: 'Agustín Flores' }
        },
        {
          nombre: '2ª Categoría',
          campeon: { nombre: 'Sebastián Vega' },
          finalista: { nombre: 'Matías Campos' }
        },
        {
          nombre: '3ª Categoría',
          campeon: { nombre: 'Nicolás Ríos' },
          finalista: { nombre: 'Joaquín Méndez' }
        },
        {
          nombre: '4ª Categoría',
          campeon: { nombre: 'Tomás Valenzuela' },
          finalista: { nombre: 'Lucas Moya' }
        }
      ]
    },
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
          },
          semifinalistas: [
            { nombre: 'Roberto Castro', club: 'Club Valparaíso' },
            { nombre: 'María Rodríguez', club: 'Club Viña del Mar' }
          ]
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
          },
          semifinalistas: [
            { nombre: 'Carlos González', club: 'Club Quilpué' },
            { nombre: 'Ana Martínez', club: 'Club San Antonio' }
          ]
        }
      ],
      estadisticas: {
        totalPartidos: 48,
        totalJugadores: 48,
        totalClubes: 4,
        duracion: '18 días'
      }
    }
  ];

  return new Response(JSON.stringify({ success: true, data: tournamentsHistory }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};