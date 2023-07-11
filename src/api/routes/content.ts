import { authenticateJwt } from "../auth/jwt";
import { IHandlerContent } from "../handlers";
import { Router } from "./router";

export function newRouterContent(handler: IHandlerContent): Router {
  return new RouterContent(handler);
}

class RouterContent extends Router {
  constructor(handler: IHandlerContent) {
    super();

    this.router().get(
      "/:id",
      authenticateJwt,
      handler.getContent.bind(handler),
    );

    this.router().get("/", authenticateJwt, handler.getContents.bind(handler));

    this.router().delete(
      "/:id",
      authenticateJwt,
      handler.deleteContent.bind(handler),
    );
  }
}
