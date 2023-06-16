export interface IContent {
  id: string;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;

  // The original code embeds more user data here,
  // but I think we only need user ID.
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}
