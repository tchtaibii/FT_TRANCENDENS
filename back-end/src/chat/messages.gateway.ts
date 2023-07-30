import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { SocketIOMIDDELWARE } from 'src/auth/auth-services/ws';
// import { ChatService } from './chat.service';

@WebSocketGateway({cors : true})
export class ChatGateway implements OnGatewayConnection{
  @WebSocketServer() server: Server;
  constructor(private readonly ChatService : MessagesService)
  {}

    afterInit(client : Socket)
    {
        client.use(SocketIOMIDDELWARE() as any);
    }

    async handleConnection(client: Socket) {
		
		console.log('connected');

	}

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, roomId: string) {
        client.join(roomId);
        console.log(`Client ${client.id} joined room ${roomId}`);
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: { RoomId: string, message: string }) {

        this.ChatService.sendMessage(payload.message, client.data.playload.userId, payload.RoomId);
        this.server.to(payload.RoomId).emit('message', payload.message);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, roomId: string) {
        client.leave(roomId);
        console.log(`Client ${client.id} left room ${roomId}`);
    }

}
