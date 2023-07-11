import { Response } from "express";

import {
  ICreateContentDto,
  toIContentDto,
  toIContentDtos,
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

  async getContents(
    req: AuthRequest<{}, {}, {}, {}>,
    res: Response,
  ): Promise<Response> {
    try {
      const contents = await this.repo.getContents();

      return res.status(200).json(toIContentDtos(contents)).end();
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

      return res.status(200).json(toIContentDto(content)).end();
    } catch (err) {
      const errMsg = `failed to get todo ${id}`;
      console.error(`${errMsg}: ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async updateContent(
    req: AuthRequest<
      { id: number },
      {},
      { rating: number | undefined; comment: string | undefined },
      {}
    >,
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

    // Use undefined to skip field when updating
    let rating: number | undefined = req.body.rating;
    let comment: string | undefined = req.body.comment;
    if (!comment || comment === "") {
      comment = undefined;
    }

    try {
      const updated = await this.repo.updateContent(
        { id, userId: req.payload.id },
        { rating, comment },
      );

      return res.status(200).json(toIContentDto(updated)).end();
    } catch (err) {
      const errMsg = `failed to update content ${id}`;
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
      const userId = req.payload.id;
      const deleted = await this.repo.deleteContent({ id, userId });

      return res.status(200).json(toIContentDto(deleted)).end();
    } catch (err) {
      const errMsg = `failed to delete content: ${id}`;
      console.error(`${errMsg}: ${err}`);

      return res.status(500).json({ error: errMsg }).end();
    }
  }
}
