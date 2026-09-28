import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  constructor(private readonly service = new LikeService()) {}

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    try { return res.status(200).json({ status: 'success', data: await this.service.getLikes() }); }
    catch (error) { return this.handleError(res, error); }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { reviewId, userId } = req.body ?? {};
    if (!Number.isInteger(reviewId) || reviewId < 1 || !Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ status: 'fail', message: 'reviewId dan userId wajib berupa bilangan positif' });
    }
    try { return res.status(201).json({ status: 'success', data: await this.service.createLike(reviewId, userId) }); }
    catch (error) { return this.handleError(res, error); }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.service.deleteLike(Number(req.params.reviewId), Number(req.params.userId));
      return res.status(200).json({ status: 'success', data: like });
    } catch (error) { return this.handleError(res, error); }
  };

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'LIKE_ALREADY_EXISTS') {
      return res.status(409).json({ status: 'fail', message: 'Pengguna sudah menyukai ulasan ini' });
    }
    if (error instanceof Error && error.message === 'LIKE_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Like tidak ditemukan' });
    }
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: error instanceof Error ? error.message : String(error) });
  }
}