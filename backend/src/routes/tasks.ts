import express from 'express';
import { verifyToken } from '../utils/verifyToken';

const taskRoutes = express.Router();

taskRoutes.use(verifyToken);

taskRoutes.get('/', (req, res) => {
  res.json([{ id: 1, title: 'Zadanie testowe' }]);
});

export default taskRoutes;
