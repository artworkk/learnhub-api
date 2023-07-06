import { PrismaClient } from "@prisma/client";
import repo from "./domain/repositories";
import { getVideoDetails } from "./domain/services/oembed";

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

  const url = "https://www.youtube.com/watch?v=3J6ZpoPWauI";
  const details = await getVideoDetails(url);

  console.log(details);
}

main();
