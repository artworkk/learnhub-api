import { IContent } from "../../domain/entities/content";

export interface ICreateContentDTO {
  videoUrl: string;
  comment: string;
  rating: number;
}

export interface IContentsDTO {
  data: IContent[];
}
