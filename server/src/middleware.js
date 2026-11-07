import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  try {
    req.userId = jwt.verify(h.replace('Bearer ', ''), process.env.JWT_SECRET).id;
    next();
  } catch { res.status(401).json({ error: 'Avval tizimga kiring' }); }
}
