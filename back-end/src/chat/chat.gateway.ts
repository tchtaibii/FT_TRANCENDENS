<<<<<<< HEAD
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({cors : true})
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly ChatService : ChatService)
  {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    // client.emit('message', `You have joined room: ${roomId}`);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { RoomId: string, message: string }) {

    // console.log(client.data.playload, payload.message);
    // this.ChatService.sendMessage(payload.message, client.data.playload.userId, payload.RoomId);

    this.server.to(payload.RoomId).emit('message', payload.message);

  }

  // @SubscribeMessage('leaveRoom')
  // handleLeaveRoom(client: Socket, roomId: string) {
  //   client.leave(roomId);
  //   console.log(`Client ${client.id} left room ${roomId}`);
  // }
=======
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
>>>>>>> 46d7dd454019aefa009a489adde17392b1e36081
}
