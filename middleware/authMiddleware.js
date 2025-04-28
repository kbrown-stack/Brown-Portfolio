const auth = (req, res, next) => {
  // Check if user is authenticated (logged in)
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

module.exports = auth;