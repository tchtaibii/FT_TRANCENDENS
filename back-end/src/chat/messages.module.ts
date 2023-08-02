import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { RoomsController } from './messages.controller';
import { PrismaClient } from '@prisma/client';
import { ChatGateway } from './messages.gateway';
import { EventsGateway } from 'src/users/events/events.gateway';
import { EventsService } from 'src/users/events/services/events.service';
import { ChatService } from './chat.service';


@Module({
  providers: [MessagesService, PrismaClient, ChatGateway, EventsGateway, EventsService, ChatService],
  controllers: [RoomsController]
})
export class MessagesModule {}