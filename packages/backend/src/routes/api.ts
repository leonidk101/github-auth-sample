import express from 'express';

export const apiRouter = express.Router();

// Authentication middleware
const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Protected route example
apiRouter.get('/me', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Public route example
apiRouter.get('/public', (req, res) => {
  res.json({ message: 'This is a public endpoint' });
}); 