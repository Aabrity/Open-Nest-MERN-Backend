export const verifyAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Access denied. Admins only.'));
    }
    next();
  };
  