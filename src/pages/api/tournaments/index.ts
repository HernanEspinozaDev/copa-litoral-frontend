import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

interface Tournament {
  id: string;
  titulo: string;
  anio: number;
  estado: 'finalizado' | 'proximamente' | 'inscripciones-abiertas';
  lugar: string;
  fechas: string;
  categorias: Category[];
  bases: string;
  formato: string;
  precio: string;
  precioSocios: string;
  precioGeneral: string;
  recargoNocturno: string;
  fechaLimiteInscripcion: string;
  organizadores: Organizer[];
  fechasImportantes: ImportantDate[];
}
  createdAt?: string;

interface Category {
  nombre: string;
  estado: string;
  totalJugadores: number;
  ganador?: Player;
  finalista?: Player;
  jugadores: Player[];
  semifinalistas?: Player[];
}

interface Player {
  nombre: string;
  club: string;
  seed?: number;
  grupo?: string;
  partidosGanados?: number;
  setsGanados?: number;
  juegosGanados?: number;
  foto?: string;
}

interface Organizer {
  nombre: string;
  cargo: string;
  telefono: string;
}

interface ImportantDate {
  fecha: string;
  evento: string;
}

// Datos iniciales para poblar la base de datos
const initialTournaments: Tournament[] = [
  {
    id: 'copa-litoral-2025',
    titulo: 'Copa Litoral 2025',
    anio: 2025,
    estado: 'finalizado',
    lugar: 'Club de Tenis Montemar, San Antonio',
    fechas: '28 mayo - 15 junio 2025',
    categorias: [
      {
        nombre: '1ª Categoría',
        estado: 'finalizado',
        totalJugadores: 12,
        ganador: {
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
        jugadores: [
          { nombre: 'Cristian Ramírez', club: 'Club Montemar', seed: 1, grupo: 'A' },
          { nombre: 'Elías Muñoz', club: 'Club Montemar', seed: 2, grupo: 'B' },
          { nombre: 'Carlos González', club: 'Club Valparaíso', seed: 3, grupo: 'C' },
          { nombre: 'Andrés Silva', club: 'Club Viña del Mar', seed: 4, grupo: 'A' },
          { nombre: 'Roberto Pérez', club: 'Club Quilpué', seed: 5, grupo: 'B' },
          { nombre: 'Miguel Torres', club: 'Club Montemar', seed: 6, grupo: 'C' },
          { nombre: 'Juan Morales', club: 'Club Valparaíso', seed: 7, grupo: 'A' },
          { nombre: 'Luis Fernández', club: 'Club Viña del Mar', seed: 8, grupo: 'B' },
          { nombre: 'Pedro Soto', club: 'Club Quilpué', seed: 9, grupo: 'C' },
          { nombre: 'Diego Martínez', club: 'Club Montemar', seed: 10, grupo: 'A' },
          { nombre: 'Antonio Rojas', club: 'Club Valparaíso', seed: 11, grupo: 'B' },
          { nombre: 'José García', club: 'Club Viña del Mar', seed: 12, grupo: 'C' }
        ]
      },
      {
        nombre: '2ª Categoría',
        estado: 'finalizado',
        totalJugadores: 12,
        ganador: {
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
        jugadores: [
          { nombre: 'Roberto Castro', club: 'Club Valparaíso', seed: 1, grupo: 'A' },
          { nombre: 'María Rodríguez', club: 'Club Viña del Mar', seed: 2, grupo: 'B' },
          { nombre: 'Ana López', club: 'Club Quilpué', seed: 3, grupo: 'C' },
          { nombre: 'Jorge Mendoza', club: 'Club Montemar', seed: 4, grupo: 'A' },
          { nombre: 'Laura Sánchez', club: 'Club Valparaíso', seed: 5, grupo: 'B' },
          { nombre: 'David Herrera', club: 'Club Viña del Mar', seed: 6, grupo: 'C' },
          { nombre: 'Patricia Vargas', club: 'Club Quilpué', seed: 7, grupo: 'A' },
          { nombre: 'Ricardo Mendoza', club: 'Club Montemar', seed: 8, grupo: 'B' },
          { nombre: 'Sandra Jiménez', club: 'Club Valparaíso', seed: 9, grupo: 'C' },
          { nombre: 'Fernando Aguirre', club: 'Club Viña del Mar', seed: 10, grupo: 'A' },
          { nombre: 'Carmen Vega', club: 'Club Quilpué', seed: 11, grupo: 'B' },
          { nombre: 'Manuel Ortiz', club: 'Club Montemar', seed: 12, grupo: 'C' }
        ]
      },
      {
        nombre: '3ª Categoría',
        estado: 'finalizado',
        totalJugadores: 12,
        ganador: {
          nombre: 'Alexandra Flores',
          club: 'Club Quilpué',
          partidosGanados: 4,
          setsGanados: 8,
          juegosGanados: 44
        },
        finalista: {
          nombre: 'Carlos Mendoza',
          club: 'Club Montemar',
          partidosGanados: 3,
          setsGanados: 6,
          juegosGanados: 38
        },
        jugadores: [
          { nombre: 'Alexandra Flores', club: 'Club Quilpué', seed: 1, grupo: 'A' },
          { nombre: 'Carlos Mendoza', club: 'Club Montemar', seed: 2, grupo: 'B' },
          { nombre: 'Elena Torres', club: 'Club Valparaíso', seed: 3, grupo: 'C' },
          { nombre: 'Felipe Ríos', club: 'Club Viña del Mar', seed: 4, grupo: 'A' },
          { nombre: 'Gabriela Soto', club: 'Club Quilpué', seed: 5, grupo: 'B' },
          { nombre: 'Hernán Silva', club: 'Club Montemar', seed: 6, grupo: 'C' },
          { nombre: 'Isabel Morales', club: 'Club Valparaíso', seed: 7, grupo: 'A' },
          { nombre: 'Joaquín Vega', club: 'Club Viña del Mar', seed: 8, grupo: 'B' },
          { nombre: 'Karina Paredes', club: 'Club Quilpué', seed: 9, grupo: 'C' },
          { nombre: 'Leonardo Gómez', club: 'Club Montemar', seed: 10, grupo: 'A' },
          { nombre: 'Monica Soto', club: 'Club Valparaíso', seed: 11, grupo: 'B' },
          { nombre: 'Nicolás Aguirre', club: 'Club Viña del Mar', seed: 12, grupo: 'C' }
        ]
      },
      {
        nombre: '4ª Categoría',
        estado: 'finalizado',
        totalJugadores: 12,
        ganador: {
          nombre: 'Daniela Pérez',
          club: 'Club Valparaíso',
          partidosGanados: 4,
          setsGanados: 8,
          juegosGanados: 42
        },
        finalista: {
          nombre: 'Eduardo Rojas',
          club: 'Club Montemar',
          partidosGanados: 3,
          setsGanados: 6,
          juegosGanados: 36
        },
        jugadores: [
          { nombre: 'Daniela Pérez', club: 'Club Valparaíso', seed: 1, grupo: 'A' },
          { nombre: 'Eduardo Rojas', club: 'Club Montemar', seed: 2, grupo: 'B' },
          { nombre: 'Francisca Morales', club: 'Club Quilpué', seed: 3, grupo: 'C' },
          { nombre: 'Gustavo Herrera', club: 'Club Viña del Mar', seed: 4, grupo: 'A' },
          { nombre: 'Hilda Castro', club: 'Club Valparaíso', seed: 5, grupo: 'B' },
          { nombre: 'Ignacio Paredes', club: 'Club Montemar', seed: 6, grupo: 'C' },
          { nombre: 'Juana Rodríguez', club: 'Club Quilpué', seed: 7, grupo: 'A' },
          { nombre: 'Kevin Méndez', club: 'Club Viña del Mar', seed: 8, grupo: 'B' },
          { nombre: 'Lorena Silva', club: 'Club Valparaíso', seed: 9, grupo: 'C' },
          { nombre: 'Mario Aguirre', club: 'Club Montemar', seed: 10, grupo: 'A' },
          { nombre: 'Natalia Ortiz', club: 'Club Quilpué', seed: 11, grupo: 'B' },
          { nombre: 'Oscar Paredes', club: 'Club Viña del Mar', seed: 12, grupo: 'C' }
        ]
      }
    ],
    bases: `BASES– COPA LITORAL 2025
Club de Tenis Montemar, San Antonio 
Fechas estimadas: Mayo - Junio 2025 

1. CATEGORÍAS
• 1ª Categoría
• 2ª Categoría  
• 3ª Categoría
• 4ª Categoría

2. FORMATO
• 12 jugadores por categoría
• Sistema de grupos + semifinales
• Fase de grupos y semifinales: 2 sets convencionales, en caso de empate se juega un super tie-break a 10 puntos
• Final: al mejor de 3 sets convencionales

3. INSCRIPCIONES
• Socios Club Montemar: $18.000
• Público general: $23.000
• Recargo nocturno: $1.000 por partido programado después de las 18:00 hrs (uso de luz artificial)
• Fecha límite de inscripción: Lunes 26 de mayo, hasta las 17:00 hrs

4. PREMIOS Y ASCENSOS
• Campeones: Trofeo + medalla + ascenso de categoría
• Finalistas: Medalla
• Semifinalistas: Diploma

5. DISPOSICIONES GENERALES
• Pelotas: Head ATP (amarillas)
• Reservas: 48 horas antes del partido
• Indumentaria: Apropiada para tenis
• Conducta: Deportiva y respetuosa

6. ORGANIZACIÓN
Directores del Torneo
• Cristian Ramírez Meneses – Profesor de Educación Física y Salud – +56 9 3203 3223
• Elías Muñoz Ríos – Instructor de Tenis – +56 9 9002 4571
Coordinadores por Categoría
• 1ª y 2ª Categoría: Cristian Ramírez
• 3ª y 4ª Categoría: Elías Muñoz

¡Te esperamos en la Copa Litoral!`,
    formato: 'Sistema de grupos + semifinales (12 jugadores por categoría)',
    precio: '$18.000 socios / $23.000 general',
    precioSocios: '$18.000',
    precioGeneral: '$23.000',
    recargoNocturno: '$1.000',
    fechaLimiteInscripcion: 'Lunes 26 de mayo, hasta las 17:00 hrs',
    organizadores: [
      { nombre: 'Cristian Ramírez Meneses', cargo: 'Profesor de Educación Física y Salud', telefono: '+56 9 3203 3223' },
      { nombre: 'Elías Muñoz Ríos', cargo: 'Instructor de Tenis', telefono: '+56 9 9002 4571' }
    ],
    fechasImportantes: [
      { fecha: '26 de mayo', evento: 'Fecha límite de inscripción' },
      { fecha: '28 de mayo', evento: 'Inicio del torneo' },
      { fecha: '15 de junio', evento: 'Final del torneo' }
    ]
  }
];

// --- Helper functions for data access ---

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'tournaments.json');

/**
 * NOTE: The initialTournaments constant is quite large.
 * For better code organization, consider moving it to its own file,
 * e.g., `src/data/initial-data.ts`, and importing it here.
 */

async function getTournaments(): Promise<Tournament[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it with initial data
      const dataDir = path.dirname(DATA_PATH);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(DATA_PATH, JSON.stringify(initialTournaments, null, 2));
      return initialTournaments;
    }
    // Re-throw other errors
    throw error;
  }
}

async function saveTournaments(tournaments: Tournament[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(tournaments, null, 2));
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const tournaments = await getTournaments();
    const anio = url.searchParams.get('anio');
    const estado = url.searchParams.get('estado');

    let filteredTournaments = tournaments;

    if (anio) {
      filteredTournaments = filteredTournaments.filter(t => t.anio === parseInt(anio));
    }

    if (estado) {
      filteredTournaments = filteredTournaments.filter(t => t.estado === estado);
    }

    return new Response(JSON.stringify({
      success: true,
      data: filteredTournaments,
      total: filteredTournaments.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Error al obtener torneos:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al obtener torneos',
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

    // Validar datos
    if (!body.titulo || !body.anio || !body.lugar) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Datos incompletos. Se requiere titulo, anio y lugar.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tournaments = await getTournaments();

    // Create a new tournament object with defaults for optional/generated fields
    const newTournament: Tournament = {
      id: body.id || `tournament-${Date.now()}`,
      titulo: body.titulo,
      anio: body.anio,
      estado: body.estado || 'proximamente',
      lugar: body.lugar,
      fechas: body.fechas || '',
      categorias: body.categorias || [],
      bases: body.bases || '',
      formato: body.formato || '',
      precio: body.precio || '',
      precioSocios: body.precioSocios || '',
      precioGeneral: body.precioGeneral || '',
      recargoNocturno: body.recargoNocturno || '',
      fechaLimiteInscripcion: body.fechaLimiteInscripcion || '',
      organizadores: body.organizadores || [],
      fechasImportantes: body.fechasImportantes || [],
      createdAt: new Date().toISOString(),
    };

    // Agregar nuevo torneo
    tournaments.push(newTournament);

    // Guardar datos actualizados
    await saveTournaments(tournaments);

    return new Response(JSON.stringify({
      success: true,
      data: newTournament,
      message: 'Torneo creado exitosamente'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error al crear torneo:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al crear torneo',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
