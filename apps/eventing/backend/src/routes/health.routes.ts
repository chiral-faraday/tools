import { Router } from 'express';

export function createHealthRouter(): Router {
  const router = Router();

  router.get('/', (req, res) => {
    res.json({ status: 'ok' });
  });

  return router;
}
