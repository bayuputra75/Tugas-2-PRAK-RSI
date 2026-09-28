import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemService.ts';

export class MenuItemController {
  constructor(private readonly service = new MenuItemService()) {}

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    try { return res.status(200).json({ status: 'success', data: await this.service.getMenuItems() }); }
    catch (error) { return this.handleError(res, error); }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    try { return res.status(200).json({ status: 'success', data: await this.service.getMenuItem(Number(req.params.id)) }); }
    catch (error) { return this.handleError(res, error); }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const input = req.body ?? {};
    if (!Number.isInteger(input.stallId) || typeof input.name !== 'string' || !input.name.trim() ||
        !Number.isInteger(input.price) || input.price < 0 || typeof input.isAvailable !== 'boolean') {
      return res.status(400).json({ status: 'fail', message: 'stallId, name, price, dan isAvailable wajib valid' });
    }
    try { return res.status(201).json({ status: 'success', data: await this.service.createMenuItem(input) }); }
    catch (error) { return this.handleError(res, error); }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const input = req.body ?? {};
    if (Object.keys(input).length === 0 ||
        input.stallId !== undefined && !Number.isInteger(input.stallId) ||
        input.name !== undefined && (typeof input.name !== 'string' || !input.name.trim()) ||
        input.price !== undefined && (!Number.isInteger(input.price) || input.price < 0) ||
        input.isAvailable !== undefined && typeof input.isAvailable !== 'boolean') {
      return res.status(400).json({ status: 'fail', message: 'Data menu tidak valid' });
    }
    try { return res.status(200).json({ status: 'success', data: await this.service.updateMenuItem(Number(req.params.id), input) }); }
    catch (error) { return this.handleError(res, error); }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try { return res.status(200).json({ status: 'success', data: await this.service.deleteMenuItem(Number(req.params.id)) }); }
    catch (error) { return this.handleError(res, error); }
  };

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'MENU_ITEM_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Menu tidak ditemukan' });
    }
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: error instanceof Error ? error.message : String(error) });
  }
}