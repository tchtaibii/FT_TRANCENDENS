import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controlers/users.controller';
import { AccessTokenMiddleware } from 'src/access-token-middleware/access-token.middleware';
import { ProfileController } from './controlers/profile.controller';
import { HomeController } from './controlers/home.controller';
import { ProfileService } from './services/profile.service';
import { HomeService } from './services/home.service';
import { SettingController } from './controlers/setting.controller';
import { SettingService } from './services/setting.service';
import { FriendshipController } from './controlers/friendship.controller';
import { FriendshipService } from './services/friendship.service';
import { NotificationGateway } from 'src/events/notification/notification.gateway';
import { EventsModule } from 'src/events/events.module';

@Module({
  providers: [UsersService, ProfileService, HomeService, SettingService, FriendshipService, NotificationGateway],
  controllers: [UsersController, ProfileController, HomeController, SettingController, FriendshipController],
  exports: [UsersService, NotificationGateway],
  imports: [EventsModule] // Import the EventsModule here
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenMiddleware)
      .forRoutes('*');
  }
}
