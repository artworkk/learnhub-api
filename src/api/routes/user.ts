import { IHandlerUser } from "../handlers";
import { Router } from "./router";

export function NewRouterUser(handler: IHandlerUser): Router {
  return new RouterUser(handler);
}

class RouterUser extends Router {
  constructor(handler: IHandlerUser) {
    super();

    this.router().post("/register", handler.register.bind(handler));
    this.router().post("/login", handler.login.bind(handler));
  }
}
