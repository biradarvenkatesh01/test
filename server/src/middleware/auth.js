import { getAuth } from '@clerk/express';

export function requireAuth(req, res, next) {
  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Authentication token is missing or invalid.',
    });
  }

  // Inject verified user ID onto the request
  req.userId = auth.userId;
  next();
}

export default requireAuth;
