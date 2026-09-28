import { FlagRepository, type FlagStatus } from '../repositories/flagRepository.ts';

export class FlagService {
  constructor(private readonly repository = new FlagRepository()) {}

  getFlags() {
    return this.repository.findAll();
  }

  async updateFlagStatus(id: number, status: FlagStatus) {
    const flag = await this.repository.updateStatus(id, status);
    if (!flag) throw new Error('FLAG_NOT_FOUND');
    return flag;
  }
}