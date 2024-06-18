import { Controller, Get, Post, Body, Put, Param, Delete, Res, Req, HttpStatus, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from "@nestjs/swagger";
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Posts')
@Controller('posts')
//@UseGuards(JwtAuthGuard)
export class PostsController {
  private logger = new Logger('PostController');
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createPostDto: CreatePostDto, @GetUser() currentUser: User, @Res() res: Response, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    //if (createPostDto.category == 'notice' && !currentUser.admin) return res.status(HttpStatus.NOT_ACCEPTABLE).json({"error": "You have to be admin"});
    //this.logger.debug('User:', currentUser);
    await this.postsService.create(createPostDto, file, currentUser);
    return res.status(HttpStatus.OK).json({"message" : "Post created successfully"});
  }

  @Get()
  async findAll(@Req() req: Request) {
    const builder = await this.postsService.queryBuilder('posts');

    if(req.query.s) {
      builder.where("posts.title LIKE :s OR posts.user LIKE :s", {s: `%${req.query.s}%`})
    }

    const sort: any = req.query.sort;
    if (sort=='desc' || sort=='asc') {
      builder.orderBy('posts.updated_at', sort.toUpperCase());
    }

    return {data: await builder.getMany()};
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    let post = await this.postsService.findOne(+id)
    if(post) return res.status(HttpStatus.OK).json(post)
    return res.status(HttpStatus.NOT_FOUND).json({"error" : "This resource  no longer exist or has been removed"})
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @GetUser() currentUser: User, @Res() res: Response) {
    //this.logger.debug('User:', req.user);
    //if (updatePostDto.category == 'notice' && !currentUser.admin) return res.status(HttpStatus.NOT_ACCEPTABLE).json({"error": "You have to be admin"});
    const response = await this.postsService.update(+id, updatePostDto);
    if(response) return res.status(HttpStatus.OK).json({"message" : "Post information updated successfully"});
    return res.status(HttpStatus.NOT_FOUND).json({"error" : "The resource to be updated no longer exist"})
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() currentUser: User, @Res() res: Response) {
    let post = await this.postsService.findOne(+id)
    //this.logger.debug('User:', req.user);
    //if (post.category == 'notice' && !currentUser.admin) return res.status(HttpStatus.NOT_ACCEPTABLE).json({"error": "You have to be admin"});
    await this.postsService.remove(+id);
    res.status(HttpStatus.OK).json({"message" : "Post details deleted successfully"});
  }
}
