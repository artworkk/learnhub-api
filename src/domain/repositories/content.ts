import { IRepositoryContent, ContentDb } from ".";
import {
  ICreateContent,
  IContent,
  IContentWithUser,
} from "../entities/content";

export function newRepositoryContent(db: ContentDb): IRepositoryContent {
  return new DataLinkContent(db);
}

class DataLinkContent implements IRepositoryContent {
  private readonly contentDb: ContentDb;
  constructor(db: ContentDb) {
    this.contentDb = db;
  }

  async createContent(content: ICreateContent): Promise<IContentWithUser> {
    return await this.contentDb.create({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
            password: false,
          },
        },
      },
      data: {
        ...content,
        userId: undefined,
        user: {
          connect: {
            id: content.userId,
          },
        },
      },
    });
  }

  async getContents(): Promise<IContent[]> {
    return await this.contentDb
      .findMany()
      .then((contents) => {
        if (!contents) {
          return Promise.resolve([]);
        }

        return Promise.resolve(contents);
      })
      .catch((err) => Promise.reject(`failed to get contents: ${err}`));
  }

  async getContent(id: number): Promise<IContent> {
    return await this.contentDb
      .findFirst()
      .then((content) => {
        if (!content) {
          return Promise.reject(`content ${id} not found`);
        }

        return Promise.resolve(content);
      })
      .catch((err) => Promise.reject(`failed to get content ${id}: ${err}`));
  }

  async deleteContent(id: number): Promise<void> {
    return await this.contentDb
      .delete({
        where: { id },
      })
      .then((_) => Promise.resolve())
      .catch((err) => Promise.reject(`failed to delete content ${id}: ${err}`));
  }
}
