import { UsersService } from './usersService';

export interface UserControllerContext {
  id?: string;
}

/**
 *I think of controllers as "orchestrators". They call the services, which contain more "pure" business logic. 
 But by themselves,controllers don't really contain any logic other than handling the request and calling services. 
 The services do most of the work, while the controllers orchestrate the service calls and decide what to do with the data returned.
 */
export class UsersController {
  service: UsersService;
  userIdIsValid: boolean;
  id: number;
  constructor({ id }: UserControllerContext) {
    this.service = new UsersService();
    this.id = id !== undefined ? Number(id) : NaN;
    this.userIdIsValid = true;
    this.userIdIsValid = Number.isInteger(this.id);
  }

  async getAllUsers() {
    return { users: await this.service.getAllUsers() };
  }

  async getUser() {
    if (!this.userIdIsValid) {
      return { user: null };
    }
    return { user: await this.service.getUser(this.id) };
  }

  async deleteUser() {
    if (!this.userIdIsValid) {
      return { user: null };
    }
    return { user: await this.service.deleteUser(this.id) };
  }
}
