interface Env {
  ALLOWED_ORIGIN: string
  ANTHROPIC_API_KEY: string
  // DB: D1Database // Uncomment when D1 is configured
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: getCorsHeaders(env.ALLOWED_ORIGIN),
      })
    }

    const url = new URL(request.url)

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env.ALLOWED_ORIGIN),
        },
      })
    }

    // Chat endpoint
    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        const body = await request.json() as { message: string }

        if (!body.message) {
          return new Response(
            JSON.stringify({ error: 'Message is required' }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...getCorsHeaders(env.ALLOWED_ORIGIN),
              },
            }
          )
        }

        // TODO: Implement rate limiting with D1
        // TODO: Call Claude API

        return new Response(
          JSON.stringify({
            message: 'Chat API scaffold. Implementation coming soon.',
            received: body.message,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...getCorsHeaders(env.ALLOWED_ORIGIN),
            },
          }
        )
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid request body' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...getCorsHeaders(env.ALLOWED_ORIGIN),
            },
          }
        )
      }
    }

    return new Response('Not found', { status: 404 })
  },
}

function getCorsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}
