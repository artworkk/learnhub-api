import { PrismaClient } from "@prisma/client";
import repo from "./domain/repositories";

async function main() {
  const db = new PrismaClient();
  const repoUser = repo.newRepositoryUser(db.user);
  const repoContent = repo.newRepositoryContent(db.content);

  const user = await repoUser.createUser({
    username: "art",
    password: "1234",
    name: "prem",
  });

  const content = await repoContent.createContent({
    videoTitle: "stepdad bbc",
    videoUrl: "https://foo.bar",
    rating: 5,
    comment: "noice",
    thumbnailUrl: "https://thumb.nail",
    creatorName: "foo",
    creatorUrl: "",
    userId: user.id,
  });

  console.log(content);
}

main();
