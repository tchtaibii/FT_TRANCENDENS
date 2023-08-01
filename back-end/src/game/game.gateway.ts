import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { SocketIOMIDDELWARE } from 'src/auth/auth-services/ws';

@WebSocketGateway({cors : true, namespace : 'game'})
export class GameGateway implements OnGatewayConnection{
 
  @WebSocketServer()
  server : Server

  	afterInit(client : Socket)
	{
		client.use(SocketIOMIDDELWARE() as any);
	}

  async handleConnection(client: Socket) {
		
	}
}
