import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { EventsService } from '../services/events.service';

@WebSocketGateway({cors : true})
export class NotificationGateway {
  constructor(private readonly socketService : EventsService){}

	@SubscribeMessage('notification')
	handleNotification(clientId, data)
	{
		this.socketService.emitToClient(clientId, 'notification', data);
	}

	@SubscribeMessage('request')
	handleInvitation(clientId, data)
	{
		this.socketService.emitToClient(clientId, 'request', data);
	}

}
