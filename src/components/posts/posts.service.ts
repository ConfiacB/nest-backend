import { Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Posts as Post } from './entities/post.entity';
import { User } from '../auth/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class PostsService {
  AWS_S3_BUCKET = 'awsbucket-nest-backend';
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async uploadFile(file) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-northeast-2',
      },
    };
    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async create(createPostDto: CreatePostDto, file: Express.Multer.File, user: User) {
    const {title, content, category} = createPostDto;
    const newPost = new Post();
    newPost.title = title;
    newPost.content = content;
    newPost.category = category;
    newPost.user = user;
    const s3Res = await this.uploadFile(file);
    if(s3Res) newPost.file = s3Res.Location
    return await this.postsRepository.save(newPost).then(res => res);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find()
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOneBy({
      id: id
    });
  }

  async queryBuilder(alias: string) {
    return this.postsRepository.createQueryBuilder(alias);
  }

  async update(id:number, data: object): Promise<Post | UpdateResult | undefined> {
    const post = await this.findOne(id).then(res =>res);
    if(post) return await this.postsRepository.update(id, data).then(res => res);
    return ;
  }

  async remove(id: number) {
    return await this.postsRepository.delete(id);
  }
}
