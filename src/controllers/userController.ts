import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';

const roles = ['admin', 'owner', 'customer'];

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  getUsers = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userService.getUsers();
      return res.status(200).json({ status: 'success', data: users });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createUser = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password, role } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' ||
        typeof password !== 'string' || password.length < 8 || !roles.includes(role)) {
      return res.status(400).json({
        status: 'fail',
        message: 'name, email, password (minimal 8 karakter), dan role yang valid wajib diisi',
      });
    }

    try {
      const user = await this.userService.createUser({ name: name.trim(), email: email.trim(), password, role });
      return res.status(201).json({ status: 'success', data: user });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: unknown): Response {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}