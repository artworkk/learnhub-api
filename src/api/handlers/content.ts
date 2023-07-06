import { Response } from "express";

import {
  ICreateContentDto,
  ToIContentDto,
  ToIContentsDto,
} from "../../domain/entities/content";

import { IRepositoryContent } from "../../domain/repositories";
import { getVideoDetails } from "../../domain/services/oembed";
import { IHandlerContent } from ".";
import { AuthRequest } from "../auth/jwt";

export function newHandlerContent(repo: IRepositoryContent): IHandlerContent {
  return new HandlerContent(repo);
}

class HandlerContent implements IHandlerContent {
  private readonly repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async createContent(
    req: AuthRequest<{}, {}, ICreateContentDto, {}>,
    res: Response,
  ): Promise<Response> {
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

      return res.status(201).json(ToIContentDto(createdContent)).end();
    } catch (err) {
      const errMsg = "failed to create content";
      console.error(`${errMsg} ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getContents(
    req: AuthRequest<{}, {}, {}, {}>,
    res: Response,
  ): Promise<Response> {
    try {
      const contents = await this.repo.getContents();

      return res.status(200).json(ToIContentsDto(contents)).end();
    } catch (err) {
      const errMsg = `failed to get contents`;
      console.error(`${errMsg}: ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getContent(
    req: AuthRequest<{ id: number }, {}, {}, {}>,
    res: Response,
  ): Promise<Response> {
    if (!req.params.id) {
      return res.status(400).json({ error: "missing id in params" }).end();
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id '${id}' is not number` })
        .end();
    }

    try {
      const content = await this.repo.getContent(id);
      if (!content) {
        return res
          .status(404)
          .json({ error: `no such content: ${id}` })
          .end();
      }

      return res.status(200).json(ToIContentDto(content)).end();
    } catch (err) {
      const errMsg = `failed to get todo ${id}`;
      console.error(`${errMsg}: ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async deleteContent(
    req: AuthRequest<{ id: number }, {}, {}, {}>,
    res: Response,
  ): Promise<Response> {
    if (!req.params.id) {
      return res.status(400).json({ error: "missing id in params" }).end();
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id '${id}' is not number` })
        .end();
    }

    try {
      const deleted = await this.repo.deleteContent(id);

      return res.status(200).json(ToIContentDto(deleted)).end();
    } catch (err) {
      const errMsg = `failed to delete content: ${id}`;
      console.error(`${errMsg}: ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }
}
