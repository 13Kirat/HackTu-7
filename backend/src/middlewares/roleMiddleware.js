const checkRole = (requiredPermissionsOrRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. No role assigned.' 
      });
    }

    // Role could be populated (object) or just an ID (string)
    const role = req.user.role;
    const userRoleName = typeof role === 'object' ? role.name : null;
    const userPermissions = (typeof role === 'object' && role.permissions) ? role.permissions : [];
    
    // If requiredPermissionsOrRoles is empty, allow.
    if (!requiredPermissionsOrRoles || requiredPermissionsOrRoles.length === 0) {
      return next();
    }

    // Common Admin Override
    if (userRoleName === 'Company Admin' || userRoleName === 'Super Admin') {
      return next();
    }

    // Check if user's role name matches OR if they have any of the specific permissions
    // Also support checking against role ID string just in case
    const hasAccess = requiredPermissionsOrRoles.some(item => 
        (userRoleName && item.toLowerCase() === userRoleName.toLowerCase()) || 
        userPermissions.includes(item) ||
        (typeof role === 'string' && role === item)
    );

    if (!hasAccess) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Sufficient permissions not found.` 
      });
    }

    next();
  };
};

module.exports = { checkRole };
