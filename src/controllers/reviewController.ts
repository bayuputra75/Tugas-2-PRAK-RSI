import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  constructor(private readonly service = new ReviewService()) {}

  getAll = async (req: Request, res: Response): Promise<Response> => {
    const stallId = req.query.stallId === undefined ? undefined : Number(req.query.stallId);
    if (stallId !== undefined && (!Number.isInteger(stallId) || stallId < 1)) {
      return res.status(400).json({ status: 'fail', message: 'stallId tidak valid' });
    }
    try { return res.status(200).json({ status: 'success', data: await this.service.getReviews(stallId) }); }
    catch (error) { return this.handleError(res, error); }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    try { return res.status(200).json({ status: 'success', data: await this.service.getReview(Number(req.params.id)) }); }
    catch (error) { return this.handleError(res, error); }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const input = req.body ?? {};
    if (!Number.isInteger(input.stallId) || input.stallId < 1 || !Number.isInteger(input.userId) || input.userId < 1 ||
        !Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5 ||
        input.comment !== undefined && input.comment !== null && typeof input.comment !== 'string') {
      return res.status(400).json({ status: 'fail', message: 'stallId, userId, rating (1-5), dan comment tidak valid' });
    }
    try { return res.status(201).json({ status: 'success', data: await this.service.createReview(input) }); }
    catch (error) { return this.handleError(res, error); }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try { return res.status(200).json({ status: 'success', data: await this.service.deleteReview(Number(req.params.id)) }); }
    catch (error) { return this.handleError(res, error); }
  };

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'REVIEW_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Ulasan tidak ditemukan' });
    }
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: error instanceof Error ? error.message : String(error) });
  }
}