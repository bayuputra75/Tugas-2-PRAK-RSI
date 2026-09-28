import { MenuItemRepository, type MenuItemInput } from '../repositories/menuItemRepository.ts';

export class MenuItemService {
  constructor(private readonly repository = new MenuItemRepository()) {}

  getMenuItems() {
    return this.repository.findAll();
  }

  async getMenuItem(id: number) {
    const item = await this.repository.findById(id);
    if (!item) throw new Error('MENU_ITEM_NOT_FOUND');
    return item;
  }

  async createMenuItem(input: MenuItemInput) {
    const created = await this.repository.create(input);
    if (!created) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.getMenuItem(created.id);
  }

  async updateMenuItem(id: number, input: Partial<MenuItemInput>) {
    const updated = await this.repository.update(id, input);
    if (!updated) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.getMenuItem(id);
  }

  async deleteMenuItem(id: number) {
    const deleted = await this.repository.remove(id);
    if (!deleted) throw new Error('MENU_ITEM_NOT_FOUND');
    return deleted;
  }
}