import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Server, Socket } from "socket.io"
import { Client } from 'socket.io/dist/client';
import { SocketIOMIDDELWARE } from 'src/auth/auth-services/ws';
import * as cookie from 'cookie';
import { EventsService } from '../services/events.service';
import { UsersService } from 'src/users/services/users.service';
import { PrismaClient } from '@prisma/client';
import { threadId } from 'worker_threads';


@WebSocketGateway({cors : true})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socketService : EventsService){}
  prisma = new PrismaClient();


  @WebSocketServer()
  server : Server

  	afterInit(client : Socket)
	{
		client.use(SocketIOMIDDELWARE() as any);
	}

	async handleConnection(client: Socket) {
		
		console.log('connected');

		await this.prisma.user.update({
			where : { UserId : client.data.playload.userId },
			data : { status : true},
		})
		this.socketService.storeSocket(client.data.playload.userId, client);
	}

	async handleDisconnect(client :Socket) {
		const user = await this.prisma.user.findUnique({
			where : {UserId : client.data.playload.userId}
		})

		if (!user)
			return ;

		await this.prisma.user.update({
			where : { UserId : user.UserId },
			data : { status : false},
		})
		this.socketService.removeSocket(client.data.playload.userId, client);
	}

}
