import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();
const controller = new LikeController();

likeRouter.get('/', (req, res) => controller.getAll(req, res));
likeRouter.post('/', (req, res) => controller.create(req, res));
likeRouter.delete('/:reviewId/:userId', (req, res) => controller.delete(req, res));

export { likeRouter };