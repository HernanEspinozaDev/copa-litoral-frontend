// src/pages/api/torneos/update.ts
import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { updateItem } from '@lib/database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../../data');
const TOURNAMENTS_FILE = path.join(DATA_DIR, 'torneos.json');

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const { name, date, location, description, categories, imageUrl } = await request.json();
    
    // Validate required fields
    if (!id || !name || !date || !location || !description || !categories) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update tournament
    const updatedTournament = {
      id,
      name,
      date,
      location,
      description,
      categories,
      imageUrl
    };
    
    const result = updateItem('torneos.json', id, updatedTournament);
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Tournament not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true, tournament: updatedTournament }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
