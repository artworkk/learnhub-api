import { Request, Response } from "express";
import { IRepositoryContent } from "../../domain/repositories";
import { ICreateContentDto } from "../../domain/entities/content";
import { getVideoDetails } from "../../domain/services/oembed";

class HandlerContent {
  private readonly repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async createContent(req: Request, res: Response): Promise<Response> {
    const createContent: ICreateContentDto = req.body;
    if (!createContent.videoUrl) {
      return res.status(400).json({ error: "missing videoUrl in body" }).end();
    }

    try {
      const details = await getVideoDetails(createContent.videoUrl);
      const createdContent = await this.repo.createContent({
        ...details,
        userId: "foo", // @TODO: use JWT middleware
        ...createContent,
      });

      const created = {
        ...createdContent,
        user: undefined,
        postedBy: createdContent.user,
      };

      return res.status(201).json(created).end();
    } catch (err) {
      const errMsg = "failed to create content";
      console.error(`${errMsg} ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getContents(req: Request, res: Response): Promise<Response> {
    try {
      const contents = await this.repo.getContents();

      return res.status(200).json(contents).end();
    } catch (err) {
      const errMsg = `failed to get contents`;
      console.error(`${errMsg}: ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }
}
