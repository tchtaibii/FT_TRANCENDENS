import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { EventsService } from '../services/events.service';

@WebSocketGateway()
export class NotificationGateway {
  // constructor(private readonly socketService : EventsService){}

  // @SubscribeMessage('notification')
  // handleNotification(clientId, data)
  // {
  //   const socket = this.socketService.getSocket(clientId);
  // }
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
