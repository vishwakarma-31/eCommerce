/**
 * Session timeout middleware
 * Checks if user session has expired and logs them out automatically
 */

const sessionTimeout = (req, res, next) => {
  // If user is authenticated and has a session
  if (req.session && req.session.userId) {
    // Check if session has expired
    if (req.session.expires && Date.now() > req.session.expires) {
      // Session has expired, destroy it
      req.session.destroy(() => {
        // Redirect to login page or send appropriate response
        return res.status(401).json({
          error: 'Session expired. Please log in again.'
        });
      });
    } else {
      // Update session expiration time
      req.session.expires = Date.now() + 30 * 60 * 1000; // 30 minutes from now
      next();
    }
  } else {
    // No session, continue
    next();
  }
};

module.exports = sessionTimeout;