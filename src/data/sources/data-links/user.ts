import { IDataLinkUser } from ".";
import { IUser } from "../../../domain/entities/user";
import { IWhereUser } from "../data-models/user";
import { BasePrismaSchemaDataLink, DbDriver } from "../postgres";

export function newDataLinkUser(db: DbDriver): IDataLinkUser {
  return new DataLinkUser(db);
}

class DataLinkUser extends BasePrismaSchemaDataLink implements IDataLinkUser {
  constructor(db: DbDriver) {
    super(db);
  }

  async createUser(arg: {
    username: string;
    name: string;
    password: string;
  }): Promise<IUser> {
    return await this.db.user
      .create({
        data: {
          ...arg,
        },
      })
      .then((user) => Promise.resolve(user))
      .catch((err) =>
        Promise.reject(`failed to create user ${arg.username}: ${err}`),
      );
  }

  async getUser(where: IWhereUser): Promise<IUser> {
    return await this.db.user
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
