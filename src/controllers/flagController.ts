import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';

const statuses = ['pending', 'resolved', 'rejected'];

export class FlagController {
  constructor(private readonly service = new FlagService()) {}

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    try { return res.status(200).json({ status: 'success', data: await this.service.getFlags() }); }
    catch (error) { return this.handleError(res, error); }
  };

  updateStatus = async (req: Request, res: Response): Promise<Response> => {
    const { status } = req.body ?? {};
    if (!statuses.includes(status)) {
      return res.status(400).json({ status: 'fail', message: 'status harus pending, resolved, atau rejected' });
    }
    try { return res.status(200).json({ status: 'success', data: await this.service.updateFlagStatus(Number(req.params.id), status) }); }
    catch (error) { return this.handleError(res, error); }
  };

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'FLAG_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Laporan tidak ditemukan' });
    }
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: error instanceof Error ? error.message : String(error) });
  }
}