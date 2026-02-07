const checkRole = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied. No role assigned.' });
    }

    const userPermissions = req.user.role.permissions || [];
    
    // Check if user has ALL required permissions (or just one of them? Usually 'has permission X'). 
    // Here assume requiredPermissions is an array, and user needs at least one matching or all matching?
    // Let's implement: User must have at least one of the permissions if multiple are passed, 
    // OR if we pass a single string, they must have it.
    
    // Simplified: requiredPermissions is an array of strings. User must have at least one?
    // Let's go with: User must have permission to access.
    
    // If requiredPermissions is empty, allow.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return next();
    }

    // Common Admin Override
    if (req.user.role.name === 'Company Admin' || req.user.role.name === 'Super Admin') {
      return next();
    }

    const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = { checkRole };
