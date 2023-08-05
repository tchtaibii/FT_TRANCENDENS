import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketIOMIDDELWARE } from 'src/auth/auth-services/ws';
import { Socket, Server } from 'socket.io';


interface Ball {
	pos: { x: number, y: number },
	speed: number,
	angle: number
}

@WebSocketGateway({ cors: true, namespace: 'game' })
export class GameGateway implements OnGatewayConnection {
	private socketsMap: Map<string, Socket[]> = new Map();
	@WebSocketServer()
	server: Server

	afterInit(client: Socket) {
		client.use(SocketIOMIDDELWARE() as any);
	}


	private waitingRooms: Record<string, Socket | null> = {
		classic: null,
		football: null,
	};

	private rooms: Record<string, { ballPos: { x: number, y: number }, moveAngle: number, ballSpeed: number, intervalId: NodeJS.Timer | null, players: { id: string, pos: number }[] }> = {};

	handleConnection(client: Socket, ...args: any[]) {
		console.log('A client just connected: ' + client.id);

		const sockets = this.socketsMap.get(client.data.playload.userId) || [];

		if (sockets.length) {
			client.emit('GamesInfo', null);
			return;
		}

		sockets.push(client);

		this.socketsMap.set(client.data.playload.userId, sockets);
	}

	handleDisconnect(client: Socket) {
		console.log('A client disconnected: ' + client.id);
		for (const gameMode in this.waitingRooms) {
			if (this.waitingRooms[gameMode]?.id === client.id) {
				this.waitingRooms[gameMode] = null;
			}
		}

		const sockets = this.socketsMap.get(client.data.playload.userId);
		if (sockets) {
			const index = sockets.indexOf(client);
			if (index !== -1) {
				this.socketsMap.delete(client.data.playload.userId);
			}
		}
	}

	private waitingFriend: Socket | null = null;
	@SubscribeMessage('friends')
	handleFriendsMode(client: Socket): void {
		if (this.waitingFriend) {
			const room = `${this.waitingFriend.id}-${client.id}`;
			client.join(room);
			this.waitingFriend.join(room);

			const initialBall: Ball = { pos: { x: 0, y: 0 }, speed: 6 / 16, angle: Math.PI / 4 };

			this.rooms[room] = {
				ballPos: initialBall.pos,
				moveAngle: initialBall.angle,
				ballSpeed: initialBall.speed,
				intervalId: setInterval(() => this.updateBallPosition(room, initialBall, "classic"), 1000 / 60),
				players: [{ id: this.waitingFriend.id, pos: 0 }, { id: client.id, pos: 0 }]
			};

			this.server.to(this.waitingFriend.id).emit('startgame', { room: room, SecondPlayer: 1, chosen: "classic" });
			this.server.to(client.id).emit('startgame', { room: room, SecondPlayer: 2, chosen: "classic" });

			this.waitingFriend = null;
		}
		else {
			this.waitingFriend = client;
		}
	}


	@SubscribeMessage('gameMode')
	handleGameMode(client: Socket, gameMode: 'classic' | 'football'): void {
		console.log(`Client ${client.data.playload.username} chose ${gameMode} mode`);

		if (this.waitingRooms[gameMode]) {
			const room = `${this.waitingRooms[gameMode].id}-${client.id}`;
			client.join(room);
			this.waitingRooms[gameMode].join(room);

			const initialBall: Ball = { pos: { x: 0, y: 0 }, speed: 6 / 16, angle: Math.PI / 4 };

			const Players = {
				Player1Avatar: this.waitingRooms[gameMode].data.playload.avatar,
				Player2Avatar: client.data.playload.avatar,
				Player1Username: this.waitingRooms[gameMode].data.playload.username,
				Player2Username: client.data.playload.username,
				Player1Id: this.waitingRooms[gameMode].data.playload.userId,
				Player2Id: client.data.playload.userId,
				Mode: gameMode,
			}

			this.server.to(room).emit('GamesInfo', Players);

			this.rooms[room] = {
				ballPos: initialBall.pos,
				moveAngle: initialBall.angle,
				ballSpeed: initialBall.speed,
				intervalId: setInterval(() => this.updateBallPosition(room, initialBall, gameMode), 1000 / 60),
				players: [{ id: this.waitingRooms[gameMode].id, pos: 0 }, { id: client.id, pos: 0 }]
			};

			this.server.to(this.waitingRooms[gameMode].id).emit('startgame', { room: room, SecondPlayer: 1, chosen: gameMode });
			this.server.to(client.id).emit('startgame', { room: room, SecondPlayer: 2, chosen: gameMode });

			console.log(`Game started in ${gameMode} mode between ${this.waitingRooms[gameMode].data.playload.username} and ${client.data.playload.username}`);

			this.waitingRooms[gameMode] = null;
		} else {
			this.waitingRooms[gameMode] = client;
		}
	}

	updateBallPosition(room: string, ball: Ball, mode: string): void {
		let newX = ball.pos.x - (ball.speed * Math.cos(ball.angle));
		let newY = ball.pos.y + (ball.speed * Math.sin(ball.angle));

		const paddleHeight = 6;



		if (newX > 520 / 16 && newY <= this.rooms[room].players[1].pos + paddleHeight / 2 && newY >= this.rooms[room].players[1].pos - paddleHeight / 2) {
			newX = 520 / 16;
			ball.angle = Math.PI - ball.angle;
		}

		if (newX < -520 / 16 && newY <= this.rooms[room].players[0].pos + paddleHeight / 2 && newY >= this.rooms[room].players[0].pos - paddleHeight / 2) {
			newX = -520 / 16;
			ball.angle = Math.PI - ball.angle;
		}


		if ((newX < -565 / 16 || newX > 565 / 16)) {

			if ((mode === "football" && newY > 10) || (mode === "football" && newY < -10)) {
				if (newX < -565 / 16) {
					newX = -564 / 16;
					ball.angle = Math.PI - ball.angle;
				}
				else if (newX > 565 / 16) {
					newX = 564 / 16;
					ball.angle = Math.PI - ball.angle;
				}
			}

			if (newX < -565 / 16) {
				this.server.to(this.rooms[room].players[0].id).emit('rightscored');
				this.server.to(this.rooms[room].players[1].id).emit('leftscored');
				newX = 0;
				newY = 0;
				ball.speed = 6 / 16;
			}
			else if (newX > 565 / 16) {
				this.server.to(this.rooms[room].players[0].id).emit('leftscored');
				this.server.to(this.rooms[room].players[1].id).emit('rightscored');
				newX = 0;
				newY = 0;
				ball.speed = 6 / 16;
			}
		}

		if (newY < -320 / 16 || newY > 325 / 16) {
			newY = newY < -320 / 16 ? (-320 / 16) : (325 / 16);
			ball.angle *= -1;
			ball.speed += 0.03;
		}

		ball.pos = { x: newX, y: newY };
		this.server.to(this.rooms[room].players[0].id).emit('ballmove', ball.pos);
		this.server.to(this.rooms[room].players[1].id).emit('ballmove', ball.pos);

	}


	@SubscribeMessage('paddlemove')
	handlepaddlemove(client: Socket, payload: { room: string, pos: number, SecondPlayer: number }): void {

		console.log('hbucguugdcgudfhhudfhdfudhdhnjnddjdjjhdj', payload.room);
		client.broadcast.to(payload.room).emit('paddlemove', payload.pos);
		if (this.rooms[payload.room] && payload.SecondPlayer === 1) {
			this.rooms[payload.room].players[0].pos = payload.pos;
		}

		else if (this.rooms[payload.room] && payload.SecondPlayer === 2) {
			this.rooms[payload.room].players[1].pos = payload.pos;
			console.log('player 2 pos : ', this.rooms[payload.room].players[1].pos);
		}
	}

	@SubscribeMessage('gameended')
	handleEndgame(client: Socket, payload: { room: string }): void {
		this.rooms[payload.room].ballSpeed = 0;
		this.rooms[payload.room].ballPos.x = 0;
		this.rooms[payload.room].ballPos.y = 0;
	}

}
