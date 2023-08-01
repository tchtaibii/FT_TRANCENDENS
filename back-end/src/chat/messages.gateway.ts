import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { SocketIOMIDDELWARE } from 'src/auth/auth-services/ws';
import { EventsGateway } from 'src/users/events/events.gateway';

@WebSocketGateway({cors : true, namespace : 'chat'})
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer() server: Server;
    private rooms: { [roomName: string]: Socket[] } = {};


  constructor(private readonly ChatService : MessagesService, private readonly Notification : EventsGateway)
  {}

    afterInit(client : Socket)
    {
        client.use(SocketIOMIDDELWARE() as any);
    }

    async handleConnection(client: Socket) {
        console.log('chat connected');
    }

    handleDisconnect(client)
    {
        console.log('discoonected');
        for (const roomName in this.rooms) {
            this.rooms[roomName] = this.rooms[roomName].filter((socket) => socket.id !== client.id);
            if (this.rooms[roomName].length === 0) {
                delete this.rooms[roomName];
            }
        }
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, roomId: string) {

        if (!this.rooms[roomId]) {
            this.rooms[roomId] = [];
        }

        this.rooms[roomId].push(client);

        client.join(roomId);

        console.log(`Client ${client.id} joined room ${roomId}`);
    }

    @SubscribeMessage('message')
    async handleMessage(client: Socket, payload: { RoomId: string, message: string }) {

        const message = await this.ChatService.sendMessage(payload.message, client.data.playload.userId, payload.RoomId);
        
        if (!message.ischannel || !message.blocked.length)
        {
            this.server.to(payload.RoomId).emit('message', message.send);
            if (!message.ischannel)
            {
                const receiver = this.rooms[payload.RoomId].filter((socket) => socket.data.playload.userId !== client.data.playload.userId)
                if (receiver.length)
                {
                    const notification = await this.ChatService.getMessageNotificationInfo(client.data.playload.userId);
                    receiver.map((user) => {
                        this.Notification.handleMessages(user, notification, user.data.playload.userId);
                    })
                }
            }
        }
        else 
        {
            const room = this.rooms[payload.RoomId].filter((socket) => !message.blocked.includes(socket.data.playload.userId));

            room.map((client) =>
            {
                this.server.to(client.id).emit('message', message.send);
            })
        }
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, roomId: string) {
        client.leave(roomId);
        console.log(`Client ${client.id} left room ${roomId}`);
    }

}
