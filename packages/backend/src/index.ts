import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { config } from './config/environment.js';
import { setupAuth } from './auth/setup.js';
import { apiRouter } from './routes/api.js';
import { authRouter } from './routes/auth.js';
import { connectToDatabase } from './database/connection.js';
import { configureSecurityMiddleware } from './middleware/security.js';

// Initialize the Express application
const app = express();

// Configure security middleware
configureSecurityMiddleware(app);

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.isProduction,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
}));

// Setup authentication
app.use(passport.initialize());
app.use(passport.session());
setupAuth();

// Routes
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
async function startServer() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Initialize database schema
    const { initializeDatabase } = await import('./database/init.js');
    await initializeDatabase();
    
    // Start the server
    app.listen(config.port, () => {
      console.log(`✅ Server running on port ${config.port}`);
      console.log(`🌐 GitHub authentication callback: ${config.github.callbackUrl}`);
      console.log(`🔒 Environment: ${config.isProduction ? 'production' : 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 