import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
    private socketsMap: Map<string, Socket[]> = new Map();

    // storeSocket(clientId: string, socket: Socket): void {
    //   const sockets = this.socketsMap.get(clientId) || [];
    //   sockets.push(socket);
    //   this.socketsMap.set(clientId, sockets);
    // }

    // getSocket(clientId: string): Socket[] | undefined {
    //     return this.socketsMap.get(clientId);
    // }

    // removeSocket(clientId: string, socket: Socket): boolean {
	// 	const sockets = this.socketsMap.get(clientId);
	// 	if (sockets) {
	// 		const index = sockets.indexOf(socket);
	// 		if (index !== -1) {
	// 			sockets.splice(index, 1);
	// 			if (sockets.length === 0) {
	// 			this.socketsMap.delete(clientId);
	// 			}
	// 			return true;
	// 		}
	// 	}
	// 	return false;
    // }

    // emitToClient(clientId: string, event: string, data: any): boolean {

	// 	const sockets = this.socketsMap.get(clientId);
	// 	console.log(clientId);
	// 	if (sockets) {
	// 		sockets.forEach(socket => {
	// 			// socket.emit(event, data);
	// 	});
	// 		return true;
	// 	}
	// 	return false;
    // }
  
	// async getInfo(user1 : string, user2 : string)
	// {
	// 	const player1 
	// 	return {
	// 		Player1Avatar : "",
	// 		Player2Avatar : "",
	// 		Player1Username : "",
	// 		Player2Username : "",
	// 		Player1Id : "",
	// 		Player2Id : "",
	// 	}
	// }
}
