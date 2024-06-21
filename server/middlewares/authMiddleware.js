const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from the header
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload to request object
    req.user = decoded.user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const requireRole = role => {
  return (req, res, next) => {
    try {
      // 1. Get the token from the Authorization header
      const token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Check if the user's role matches the required role
      if (decodedToken.role !== role) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      // 4. Call the next middleware function or route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = { authMiddleware, requireRole };
