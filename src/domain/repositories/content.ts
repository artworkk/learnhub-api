import { IRepositoryContent, ContentDb } from ".";
import { ICreateContent, IContentWithUserDto } from "../entities/content";

export function newRepositoryContent(db: ContentDb): IRepositoryContent {
  return new DataLinkContent(db);
}

const includeUserDto = {
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      registeredAt: true,
      password: false,
    },
  },
};

class DataLinkContent implements IRepositoryContent {
  private readonly contentDb: ContentDb;
  constructor(db: ContentDb) {
    this.contentDb = db;
  }

  async createContent(content: ICreateContent): Promise<IContentWithUserDto> {
    return await this.contentDb.create({
      include: includeUserDto,
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

  async getContents(): Promise<IContentWithUserDto[]> {
    return await this.contentDb
      .findMany({
        include: includeUserDto,
      })
      .then((contents) => {
        if (!contents) {
          return Promise.resolve([]);
        }

        return Promise.resolve(contents);
      })
      .catch((err) => Promise.reject(`failed to get contents: ${err}`));
  }

  async getContent(id: number): Promise<IContentWithUserDto> {
    return await this.contentDb
      .findFirst({
        include: includeUserDto,
      })
      .then((content) => {
        if (!content) {
          return Promise.reject(`content ${id} not found`);
        }

        return Promise.resolve(content);
      })
      .catch((err) => Promise.reject(`failed to get content ${id}: ${err}`));
  }

  async deleteContent(id: number): Promise<IContentWithUserDto> {
    return await this.contentDb
      .delete({
        include: includeUserDto,
        where: { id },
      })
      .then((content) => Promise.resolve(content))
      .catch((err) => Promise.reject(`failed to delete content ${id}: ${err}`));
  }
}
