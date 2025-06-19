import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log('🔍 Middleware verifyToken wywołany');
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Brak tokenu' });
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    console.log('i verify token', decoded);
    if (err) {
      res.status(403).json({ message: 'Token nieważny' });
      return;
    }

    (req as AuthenticatedRequest).user = decoded as UserPayload;
    next();
  });
};
