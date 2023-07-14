import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import * as cookieParser from 'cookie-parser';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



@Module({
  imports: [GameModule, ChatModule, AuthModule, UsersModule, EventsModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/uploads',
  }),],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes('*');
  }
}

