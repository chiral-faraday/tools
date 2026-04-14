import { Router } from 'express';

export function createBindingRouter(controller: any): Router {
  const router = Router();

  router.post('/', controller.createBinding.bind(controller));
  router.delete('/', controller.deleteBinding.bind(controller));

  return router;
}
