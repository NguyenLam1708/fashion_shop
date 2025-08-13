const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  const allowedRoles = typeof roles === 'string' ? [roles] : roles;

  return (req, res, next) => {
    const header = req.header('Authorization') || req.header('authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có token' });
    }

    const token = header.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
      }

      next();
    } catch {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
  };
};

module.exports = auth;
