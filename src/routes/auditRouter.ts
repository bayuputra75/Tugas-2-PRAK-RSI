import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';

const auditRouter = Router();
const controller = new AuditController();

auditRouter.get('/', (req, res) => controller.getAll(req, res));
auditRouter.post('/', (req, res) => controller.create(req, res));

export { auditRouter };