import express from 'express';
import passport from 'passport';

export const authRouter = express.Router();

// GitHub OAuth routes
authRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/login',
    successRedirect: '/'
  })
);

// User authentication status
authRouter.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: req.user
    });
  } else {
    res.json({
      isAuthenticated: false,
      user: null
    });
  }
});

// Logout route
authRouter.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true });
  });
}); 