import { UserEdit } from '../common/schema/schema_user';
import { UsersService } from './usersService';

/**
 *I think of controllers as "orchestrators". They call the services, which contain more "pure" business logic. 
 But by themselves,controllers don't really contain any logic other than handling the request and calling services. 
 The services do most of the work, while the controllers orchestrate the service calls and decide what to do with the data returned.
 */
export class UsersController {
  service: UsersService;
  constructor() {
    this.service = new UsersService();
  }

  async getAllUsers() {
    return { users: await this.service.getAllUsers() };
  }

  async getUser(id: number) {
    return { user: await this.service.getUser(id) };
  }

  async deleteUser(id: number) {
    return { user: await this.service.deleteUser(id) };
  }

  async makeAdmin(id: number) {
    return { user: await this.service.deleteUser(id) };
  }

  async updateUser(id: number, userChange: UserEdit) {
    // see if user exists before attempting update
    const user = await this.service.getUser(id);
    if (user === null) {
      return { user };
    }
    return { user: await this.service.updateUser(id, userChange) };
  }
}
