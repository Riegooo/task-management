import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

import { NestMiddleware, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RequestLoggerMiddleware } from './common/middleware/request-time.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    UsersModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule{
  
  configure(consumer : MiddlewareConsumer) {
    consumer
      .apply(
        LoggerMiddleware,
        RequestLoggerMiddleware
      )
      .forRoutes({
        path: "task",
        method: RequestMethod.GET,
      });

    consumer
      .apply(
        LoggerMiddleware
      )
      .forRoutes({
        path: "user",
        method: RequestMethod.GET,
      });
  }
}