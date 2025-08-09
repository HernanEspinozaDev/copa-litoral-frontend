import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface TournamentHistory {
  id: string;
  titulo: string;
  anio: number;
  lugar: string;
  fechas: string;
  estado: 'finalizado';
  categorias: Category[];
  estadisticas: Statistics;
}

interface Category {
  nombre: string;
  totalJugadores: number;
  campeon: Player;
  finalista: Player;
  semifinalistas: Player[];
}

interface Player {
  nombre: string;
  club: string;
  partidosGanados: number;
  setsGanados: number;
  juegosGanados: number;
  foto?: string;
}

interface Statistics {
  totalPartidos: number;
  totalJugadores: number;
  totalClubes: number;
  duracion: string;
  asistencia: string;
}

// Datos iniciales para historial
const initialHistory: TournamentHistory[] = [
  {
    id: 'copalitoral2025',
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
          juegosGanados: 48,
          foto: '/images/players/cristian-ramirez.jpg'
        },
        finalista: {
          nombre: 'Elías Muñoz',
          club: 'Club Montemar',
          partidosGanados: 3,
          setsGanados: 6,
          juegosGanados: 42,
          foto: '/images/players/elias-munoz.jpg'
        },
        semifinalistas: [
          { nombre: 'Carlos González', club: 'Club Valparaíso', partidosGanados: 2, setsGanados: 4, juegosGanados: 24 },
          { nombre: 'Andrés Silva', club: 'Club Viña del Mar', partidosGanados: 2, setsGanados: 4, juegosGanados: 24 }
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
          juegosGanados: 45,
          foto: '/images/players/roberto-castro.jpg'
        },
        finalista: {
          nombre: 'María Rodríguez',
          club: 'Club Viña del Mar',
          partidosGanados: 3,
          setsGanados: 6,
          juegosGanados: 40,
          foto: '/images/players/maria-rodriguez.jpg'
        },
        semifinalistas: [
          { nombre: 'Ana López', club: 'Club Quilpué', partidosGanados: 2, setsGanados: 4, juegosGanados: 22 },
          { nombre: 'Jorge Mendoza', club: 'Club Montemar', partidosGanados: 2, setsGanados: 4, juegosGanados: 22 }
        ]
      },
      {
        nombre: '3ª Categoría',
        totalJugadores: 12,
        campeon: {
          nombre: 'Alexandra Flores',
          club: 'Club Quilpué',
          partidosGanados: 4,
          setsGanados: 8,
          juegosGanados: 44,
          foto: '/images/players/alexandra-flores.jpg'
        },
        finalista: {
          nombre: 'Carlos Mendoza',
          club: 'Club Montemar',
          partidosGanados: 3,
          setsGanados: 6,
          juegosGanados: 38,
          foto: '/images/players/carlos-mendoza.jpg'
        },
        semifinalistas: [
          { nombre: 'Elena Torres', club: 'Club Valparaíso', partidosGanados: 2, setsGanados: 4, juegosGanados: 20 },
          { nombre: 'Felipe Ríos', club: 'Club Viña del Mar', partidosGanados: 2, setsGanados: 4, juegosGanados: 20 }
        ]
      },
      {
        nombre: '4ª Categoría',
        totalJugadores: 12,
        campeon: {
          nombre: 'Daniela Pérez',
          club: 'Club Valparaíso',
          partidosGanados: 4,
          setsGanados: 8,
          juegosGanados: 42,
          foto: '/images/players/daniela-perez.jpg'
        },
        finalista: {
          nombre: 'Eduardo Rojas',
          club: 'Club Montemar',
          partidosGanados: 3,
          setsGanados: 6,
          juegosGanados: 36,
          foto: '/images/players/eduardo-rojas.jpg'
        },
        semifinalistas: [
          { nombre: 'Francisca Morales', club: 'Club Quilpué', partidosGanados: 2, setsGanados: 4, juegosGanados: 18 },
          { nombre: 'Gustavo Herrera', club: 'Club Viña del Mar', partidosGanados: 2, setsGanados: 4, juegosGanados: 18 }
        ]
      }
    ],
    estadisticas: {
      totalPartidos: 48,
      totalJugadores: 48,
      totalClubes: 4,
      duracion: '18 días',
      asistencia: 'Más de 200 personas'
    }
  }
];

export const GET: APIRoute = async ({ url }) => {
  try {
    // Verificar si existe archivo de datos
    const dataPath = path.join(process.cwd(), 'src', 'data', 'tournaments-history.json');
    let history = initialHistory;

    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf-8');
      history = JSON.parse(data);
    } else {
      // Crear archivo inicial si no existe
      const dataDir = path.join(process.cwd(), 'src', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dataPath, JSON.stringify(initialHistory, null, 2));
    }

    const anio = url.searchParams.get('anio');

    let filteredHistory = history;

    if (anio) {
      filteredHistory = filteredHistory.filter(t => t.anio === parseInt(anio));
    }

    return new Response(JSON.stringify({
      success: true,
      data: filteredHistory,
      total: filteredHistory.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al obtener historial',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const newHistory = body;

    // Validar datos
    if (!newHistory.titulo || !newHistory.anio || !newHistory.lugar) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Datos incompletos'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Leer datos actuales
    const dataPath = path.join(process.cwd(), 'src', 'data', 'tournaments-history.json');
    let history = initialHistory;

    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf-8');
      history = JSON.parse(data);
    }

    // Agregar nuevo historial
    history.push({
      ...newHistory,
      id: newHistory.id || `tournament-${Date.now()}`,
      createdAt: new Date().toISOString()
    });

    // Guardar datos actualizados
    fs.writeFileSync(dataPath, JSON.stringify(history, null, 2));

    return new Response(JSON.stringify({
      success: true,
      data: newHistory,
      message: 'Historial creado exitosamente'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error al crear historial:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al crear historial',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
