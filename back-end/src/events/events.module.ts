import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { WebSocketAuthGuard } from 'src/auth/auth-guard/Wsjwt-guard';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenMiddleware } from 'src/access-token-middleware/access-token.middleware';
import { EventsService } from './events.service';

@Module({
  providers: [EventsGateway, WebSocketAuthGuard, EventsService],
  imports: [JwtModule]
})

export class EventsModule {}
