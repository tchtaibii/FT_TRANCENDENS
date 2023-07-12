import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Server, Socket } from "socket.io"
import { Client } from 'socket.io/dist/client';
import { WebSocketAuthGuard } from 'src/auth/auth-guard/Wsjwt-guard';
import { SocketIOMIDDELWARE } from 'src/auth/auth-services/ws';
import * as cookie from 'cookie';
import { EventsService } from '../services/events.service';
import { UsersService } from 'src/users/services/users.service';
import { PrismaClient } from '@prisma/client';
import { threadId } from 'worker_threads';


@WebSocketGateway()
// @UseGuards(WebSocketAuthGuard)
export class EventsGateway {
  constructor(private readonly socketService : EventsService){}
  prisma = new PrismaClient();


  @WebSocketServer()
  server : Server

  afterInit(client : Socket)
  {
    client.use(SocketIOMIDDELWARE() as any);
  }

  async handleConnection(client: Socket) {

    const user = await this.prisma.user.findUnique({
      where : {
        UserId : client.data.playload.userId, 
      }
    })

	if (!user)
		throw new UnauthorizedException('no user has been found');

	await this.prisma.user.update({
		where : { UserId : user.UserId },
		data : { status : true},
	})
    this.socketService.storeSocket(client.data.playload, client);
  }

  async handleDisconnect(client :Socket) {

	const user = await this.prisma.user.findUnique({
		where : {
		  UserId : client.data.playload.userId, 
		}
	})

	if (!user)
	  throw new UnauthorizedException('no user has been found');

	await this.prisma.user.update({
		where : { UserId : user.UserId },
		data : { status : false},
	})

  }

//   @SubscribeMessage('message')
//   handleMessage(client: any): string {
//     console.log('m here');
//     this.socketService.emitToAll("message", "hello from emiit");
//     return 'Hello world!';
//   }

//   @SubscribeMessage('notification')
//   a(client: any): string {
//     console.log('m');
//     return 'notification! a zeby';
//   }
}
