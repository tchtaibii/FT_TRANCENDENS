import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventsGateway } from './gateaway/events.gateway';
import { WebSocketAuthGuard } from 'src/auth/auth-guard/Wsjwt-guard';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenMiddleware } from 'src/access-token-middleware/access-token.middleware';
import { EventsService } from './services/events.service';
import { NotificationGateway } from './notification/notification.gateway';

@Module({
  providers: [EventsGateway, EventsService, WebSocketAuthGuard, NotificationGateway],
  imports: [JwtModule],
  exports: [EventsService] // Add the export here
})

export class EventsModule {}

