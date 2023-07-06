import { Prisma } from "@prisma/client";

import { IWhereUser, newRepositoryUser } from "./user";
import { newRepositoryContent } from "./content";

import { ICreateUser, IUser } from "../entities/user";
import {
  ICreateContent,
  IContent,
  IContentWithUser,
} from "../entities/content";

export type UserDb = Prisma.UserDelegate<any>;
export type ContentDb = Prisma.ContentDelegate<any>;

export interface IRepositoryUser {
  createUser(arg: ICreateUser): Promise<IUser>;
  getUser(where: IWhereUser): Promise<IUser>;
}
export interface IRepositoryContent {
  createContent(content: ICreateContent): Promise<IContentWithUser>;
  getContents(): Promise<IContent[]>;
  getContent(id: number): Promise<IContent>;
  deleteContent(id: number): Promise<void>;
}

export default {
  newRepositoryUser,
  newRepositoryContent,
};
