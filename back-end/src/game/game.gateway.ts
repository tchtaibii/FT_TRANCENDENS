import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({cors : true})
export class GameGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
