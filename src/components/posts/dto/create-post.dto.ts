import { Category } from "../entities/post.entity";

export class CreatePostDto {
    title: string;
    content: string;
    category: Category;
}
