import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

import { newRepositoryContent } from "./domain/repositories/content";
import { newRepositoryUser } from "./domain/repositories/user";

import { newHandlerContent } from "./api/handlers/content";
import { newHandlerUser } from "./api/handlers/user";

import { App } from "./api/app";

async function main() {
  dotenv.config();
  // Create DB repos
  const db = new PrismaClient();
  const repoUser = newRepositoryUser(db.user);
  const repoContent = newRepositoryContent(db.content);

  // Create API handlers
  const handlerUser = newHandlerUser(repoUser);
  const handlerContent = newHandlerContent(repoContent);

  // Create App
  const learnhub = new App({ user: handlerUser, content: handlerContent });
  learnhub.listenAndServe(process.env.PORT || 8000);
}

main();
