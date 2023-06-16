import { IDataLinkContent } from ".";
import { IContent } from "../../../../domain/entities/content";
import { BasePrismaSchemaDataLink, DbDriver } from "..";

export function newDataLinkContent(db: DbDriver): IDataLinkContent {
  return new DataLinkContent(db);
}

class DataLinkContent
  extends BasePrismaSchemaDataLink
  implements IDataLinkContent
{
  constructor(db: DbDriver) {
    super(db);
  }

  async createContent(content: IContent): Promise<IContent> {
    return await this.db.content.create({
      data: {
        ...content,
        id: undefined,
      },
    });
  }

  async getContents(): Promise<IContent[]> {
    return await this.db.content
      .findMany()
      .then((contents) => {
        if (!contents) {
          return Promise.resolve([]);
        }

        return Promise.resolve(contents);
      })
      .catch((err) => Promise.reject(`failed to get contents: ${err}`));
  }

  async getContent(id: string): Promise<IContent> {
    return await this.db.content
      .findFirst()
      .then((content) => {
        if (!content) {
          return Promise.reject(`content ${id} not found`);
        }

        return Promise.resolve(content);
      })
      .catch((err) => Promise.reject(`failed to get content ${id}: ${err}`));
  }

  async deleteContent(id: string): Promise<void> {
    return await this.db.content
      .delete({
        where: { id },
      })
      .then((_) => Promise.resolve())
      .catch((err) => Promise.reject(`failed to delete content ${id}: ${err}`));
  }
}
