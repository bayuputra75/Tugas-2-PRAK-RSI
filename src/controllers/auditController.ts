import type { Request, Response } from 'express';
import { AuditService } from '../services/auditService.ts';

export class AuditController {
  constructor(private readonly service = new AuditService()) {}

  getAll = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.query.userId === undefined ? undefined : Number(req.query.userId);
    const targetId = req.query.targetId === undefined ? undefined : Number(req.query.targetId);
    if (userId !== undefined && (!Number.isInteger(userId) || userId < 1) ||
        targetId !== undefined && (!Number.isInteger(targetId) || targetId < 1)) {
      return res.status(400).json({ status: 'fail', message: 'Filter ID tidak valid' });
    }
    try {
      const data = await this.service.getAuditLogs({
        userId,
        targetId,
        targetTable: typeof req.query.targetTable === 'string' ? req.query.targetTable : undefined,
      });
      return res.status(200).json({ status: 'success', data });
    } catch (error) { return this.handleError(res, error); }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { userId, action, targetTable, targetId, metadata } = req.body ?? {};
    if (!Number.isInteger(userId) || userId < 1 || typeof action !== 'string' || !action.trim() ||
        typeof targetTable !== 'string' || !targetTable.trim() || !Number.isInteger(targetId) || targetId < 1 ||
        metadata !== undefined && typeof metadata !== 'object' && typeof metadata !== 'string') {
      return res.status(400).json({ status: 'fail', message: 'userId, action, targetTable, dan targetId wajib valid' });
    }
    try {
      const data = await this.service.createAuditLog({
        userId,
        action: action.trim(),
        targetTable: targetTable.trim().toUpperCase(),
        targetId,
        metadata: metadata === undefined ? null : typeof metadata === 'string' ? metadata : JSON.stringify(metadata),
      });
      return res.status(201).json({ status: 'success', data });
    } catch (error) { return this.handleError(res, error); }
  };

  private handleError(res: Response, error: unknown): Response {
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: error instanceof Error ? error.message : String(error) });
  }
}