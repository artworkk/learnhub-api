import { IRepositoryUser, UserDb } from ".";
import { ICreateUser, IUser } from "../entities/user";

export function newRepositoryUser(db: UserDb): IRepositoryUser {
  return new RepositoryUser(db);
}

export interface IWhereUser {
  id?: string;
  username?: string;
}

class RepositoryUser implements IRepositoryUser {
  userDb: UserDb;
  constructor(db: UserDb) {
    this.userDb = db;
  }

  async createUser(user: ICreateUser): Promise<IUser> {
    return await this.userDb
      .create({
        data: user,
      })
      .then((user) => Promise.resolve(user))
      .catch((err) =>
        Promise.reject(`failed to create user ${user.username}: ${err}`),
      );
  }

  async getUser(where: IWhereUser): Promise<IUser> {
    return await this.userDb
      .findUnique({ where })
      .then((user) => {
        if (!user) {
          return Promise.reject(
            `user ${where.id}, ${where.username} not found`,
          );
        }

        return Promise.resolve(user);
      })
      .catch((err) =>
        Promise.reject(`failed to get user with condition ${where}: ${err}`),
      );
  }
}
