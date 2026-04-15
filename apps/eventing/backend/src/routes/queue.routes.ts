import { Router, Request, Response } from 'express';

type QueueParams = { name: string };

export function createQueueRouter(controller: any): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response) =>
    controller.createQueue(req, res),
  );

  router.get('/', (req: Request, res: Response) =>
    controller.listQueues(req, res),
  );

  router.delete('/:name', (req: Request<QueueParams>, res: Response) =>
    controller.deleteQueue(req, res),
  );

  router.get('/:name/messages', (req: Request<QueueParams>, res: Response) =>
    controller.peekMessages(req, res),
  );

  router.delete('/:name/messages', (req: Request<QueueParams>, res: Response) =>
    controller.purgeQueue(req, res),
  );

  return router;
}
