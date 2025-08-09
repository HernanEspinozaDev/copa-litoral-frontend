// src/pages/api/sponsors/create.ts
import type { APIRoute } from 'astro';
import { createItem } from '@lib/database';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, logoUrl, website } = await request.json();
    
    // Validate required fields
    if (!name || !logoUrl || !website) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create new sponsor
    const newSponsor = {
      id: Date.now().toString(),
      name,
      logoUrl,
      website
    };
    
    createItem('sponsors.json', newSponsor);
    
    return new Response(JSON.stringify({ success: true, sponsor: newSponsor }), {
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
