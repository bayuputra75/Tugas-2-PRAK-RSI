import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();
const controller = new FlagController();

flagRouter.get('/', (req, res) => controller.getAll(req, res));
flagRouter.put('/:id', (req, res) => controller.updateStatus(req, res));

export { flagRouter };