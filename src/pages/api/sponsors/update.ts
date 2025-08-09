// src/pages/api/sponsors/update.ts
import type { APIRoute } from 'astro';
import { updateItem } from '@lib/database';

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const { name, logoUrl, website } = await request.json();
    
    // Validate required fields
    if (!id || !name || !logoUrl || !website) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update sponsor
    const updatedSponsor = {
      id,
      name,
      logoUrl,
      website
    };
    
    const result = updateItem('sponsors.json', id, updatedSponsor);
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Sponsor not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true, sponsor: updatedSponsor }), {
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
