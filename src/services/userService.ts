import { randomBytes, scryptSync } from 'node:crypto';
import { UserRepository, type CreateUserInput, type UserRole } from '../repositories/userRepository.ts';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getUsers() {
    return this.userRepository.findAll();
  }

  async createUser(input: RegisterUserInput) {
    const salt = randomBytes(16).toString('hex');
    const passwordHash = `${salt}:${scryptSync(input.password, salt, 64).toString('hex')}`;
    const userInput: CreateUserInput = {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    };
    const user = await this.userRepository.create(userInput);
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}