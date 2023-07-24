import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController]
})
=======
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway]
})

>>>>>>> 46d7dd454019aefa009a489adde17392b1e36081
export class ChatModule {}
