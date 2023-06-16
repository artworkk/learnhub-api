import { IWhereUser } from "../data-models/user";
import NewDataLinkUser from "./user";
import NewDataLinkContent from "./content";

import { IUser } from "../../../domain/entities/user";
import { IContent } from "../../../domain/entities/content";

export interface IDataLinkUser {
  createUser(arg: {
    username: string;
    name: string;
    password: string;
  }): Promise<IUser>;

  getUser(where: IWhereUser): Promise<IUser>;
}
export interface IDataLinkContent {
  createContent(content: IContent): Promise<IContent>;
  getContents(): Promise<IContent[]>;
  getContent(id: string): Promise<IContent>;
  deleteContent(id: string): Promise<void>;
}

export default { NewDataLinkUser, NewDataLinkContent };
