import helmet from 'helmet';
import express from 'express';
import { config } from '../config/environment.js';

/**
 * Configure security middleware for the Express application
 */
export function configureSecurityMiddleware(app: express.Application) {
  // Apply helmet for security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    })
  );

  // CORS configuration
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // In development, allow localhost origins
    const allowedOrigins = config.isDevelopment
      ? ['http://localhost:3000', 'http://localhost:4000']
      : [config.frontendOrigin];

    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  // Set secure cookie settings
  app.set('trust proxy', 1); // Trust first proxy
} 