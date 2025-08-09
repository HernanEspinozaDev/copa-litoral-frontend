// src/pages/api/registros/create.ts
import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createItem } from '@lib/database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../../data');
const REGISTROS_FILE = path.join(DATA_DIR, 'registros.json');

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message } = await request.json();
    
    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create new contact record
    const newRecord = {
      id: Date.now().toString(),
      name,
      email,
      message,
      date: new Date().toISOString()
    };
    
    createItem('registros.json', newRecord);
    
    return new Response(JSON.stringify({ success: true, record: newRecord }), {
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
