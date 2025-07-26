import type { APIRoute } from 'astro';

const JSONBIN_MASTER_KEY = import.meta.env.JSONBIN_MASTER_KEY;
const JSONBIN_BIN_ID = import.meta.env.JSONBIN_BIN_ID;

export const GET: APIRoute = async () => {
  try {
    if (!JSONBIN_MASTER_KEY || !JSONBIN_BIN_ID) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_MASTER_KEY,
        'X-Bin-Meta': 'false',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    const data = await response.json();
    // Handle both array format and object format
    const properties = Array.isArray(data) ? data : (data.properties || []);
    
    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch properties' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 