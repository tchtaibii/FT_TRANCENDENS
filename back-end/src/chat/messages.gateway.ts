import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { SocketIOMIDDELWARE } from 'src/auth/auth-services/ws';

@WebSocketGateway({cors : true, namespace : 'chat'})
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer() server: Server;
  constructor(private readonly ChatService : MessagesService)
  {}

    afterInit(client : Socket)
    {
        client.use(SocketIOMIDDELWARE() as any);
    }

    async handleConnection(client: Socket) {
        
        console.log('chat connected');

    }
    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, roomId: string) {
        client.join(roomId);
        console.log(`Client ${client.id} joined room ${roomId}`);
    }

    @SubscribeMessage('message')
    async handleMessage(client: Socket, payload: { RoomId: string, message: string }) {
        console.log(payload.message);
        const message = await this.ChatService.sendMessage(payload.message, client.data.playload.userId, payload.RoomId);
        this.server.to(payload.RoomId).emit('message', message);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, roomId: string) {
        client.leave(roomId);
        console.log(`Client ${client.id} left room ${roomId}`);
    }

}
