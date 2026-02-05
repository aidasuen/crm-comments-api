import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: (process.env.DB_HOST || 'localhost') as string,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: (process.env.DB_USERNAME || 'postgres') as string,
      password: (process.env.DB_PASSWORD || 'postgres') as string,
      database: (process.env.DB_DATABASE || 'crm') as string,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      autoLoadEntities: true, 
      synchronize: true, 
     }),
  

    AuthModule,
    UsersModule,
    TasksModule,
    CommentsModule,
  ],
})
export class AppModule {}