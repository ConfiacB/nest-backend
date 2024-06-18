import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../entities/post.entity";

export class CreatePostDto {
    @ApiProperty({example:"Here is a title"})
    title: string;
    @ApiProperty({example:"Here is the content"})
    content: string;
    @ApiProperty({example:"notice"})
    category: Category;
}
