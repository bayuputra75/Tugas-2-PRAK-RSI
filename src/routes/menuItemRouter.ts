import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();
const controller = new MenuItemController();

menuItemRouter.get('/', (req, res) => controller.getAll(req, res));
menuItemRouter.post('/', (req, res) => controller.create(req, res));
menuItemRouter.get('/:id', (req, res) => controller.getById(req, res));
menuItemRouter.put('/:id', (req, res) => controller.update(req, res));
menuItemRouter.delete('/:id', (req, res) => controller.delete(req, res));

export { menuItemRouter };