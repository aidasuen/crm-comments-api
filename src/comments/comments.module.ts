import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity'; // Проверь путь к сущности комментария
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Comment]), 
    UsersModule, 
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}