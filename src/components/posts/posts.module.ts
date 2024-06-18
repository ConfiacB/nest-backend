import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts as Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  exports: [TypeOrmModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
