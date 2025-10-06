import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import fetch from 'node-fetch';
import { URL } from 'url';

const app = express();
const PORT = process.env.PORT || 3005;
const DEFAULT_UA = process.env.DEFAULT_UA || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://terrano-vision.vercel.app', 'https://terrano-vision.netlify.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  try {
    const { url, ua, ref } = req.query;
    
    // Validation
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ 
        error: 'URL parameter is required',
        status: 400 
      });
    }

    // Validate URL format
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid URL format',
        status: 400 
      });
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'User-Agent': (ua as string) || DEFAULT_UA,
    };

    if (ref && typeof ref === 'string') {
      headers['Referer'] = ref;
      try {
        const refUrl = new URL(ref);
        headers['Origin'] = `${refUrl.protocol}//${refUrl.host}`;
      } catch {
        // Ignore invalid referer
      }
    }

    // Forward Range header for video streaming
    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    console.log(`[PROXY] ${url} - UA: ${headers['User-Agent']?.substring(0, 50)}...`);

    // Make request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      headers,
      signal: controller.signal,
      redirect: 'follow'
    });

    clearTimeout(timeoutId);

    // Forward response headers
    const responseHeaders: Record<string, string> = {};
    
    // Essential headers for streaming
    const headersToForward = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control',
      'expires',
      'last-modified',
      'etag'
    ];

    headersToForward.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders[header] = value;
      }
    });

    // CORS headers
    responseHeaders['Access-Control-Allow-Origin'] = '*';
    responseHeaders['Access-Control-Allow-Headers'] = 'Range';
    responseHeaders['Access-Control-Expose-Headers'] = 'Content-Length, Content-Range, Accept-Ranges';

    // Set response headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Set status code
    res.status(response.status);

    // Stream response
    if (response.body) {
      return response.body.pipe(res);
    } else {
      return res.end();
    }

  } catch (error) {
    console.error('[PROXY ERROR]', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'Request timeout',
        status: 408 
      });
    }

    return res.status(500).json({ 
      error: 'Proxy request failed',
      status: 500,
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Handle preflight requests
app.options('/proxy', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(200).end();
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    status: 404 
  });
});

// Error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[SERVER ERROR]', error);
  res.status(500).json({ 
    error: 'Internal server error',
    status: 500 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TerranoVision Server running on port ${PORT}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/proxy`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
