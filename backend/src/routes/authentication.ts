import * as express from 'express';
import { Request, Response } from 'express';
import { Secret, sign, SignOptions } from 'jsonwebtoken';
import { AuthenticatedRequest, verifyToken } from '../utils/verifyToken';

const authRoutes = express.Router();

interface LoginBody {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

interface ErrorResponse {
  message: string;
  error?: unknown;
}

authRoutes.post(
  '/login',
  (
    req: Request<object, AuthResponse | ErrorResponse, LoginBody>,
    res: Response<AuthResponse | ErrorResponse>,
  ): void => {
    const { email, password } = req.body;
    console.log(email, password);
    // TODO: Przetwarzanie danych i hashowanie
    if (email && password) {
      const jwtPayload = { email };
      const jwtOptions: SignOptions = { expiresIn: '1h' };

      const secret: Secret = process.env.JWT_SECRET!;
      if (!secret) {
        res.status(500).json({ message: 'Missing JWT secret' });
        return;
      }

      const token: string = sign(jwtPayload, secret, jwtOptions);
      res.status(200).json({ token });
      return;
    }

    res.status(400).json({ message: 'Invalid credentials' });
    return;
  },
);

authRoutes.get('/verify', verifyToken, (req, res) => {
  res
    .status(200)
    .json({ valid: true, user: (req as AuthenticatedRequest).user });
});

export default authRoutes;
