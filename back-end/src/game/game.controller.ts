import { Controller, Post, Req } from '@nestjs/common';

@Controller('game')
export class GameController {
    constructor(){}
	
	@Post('StoreData')
	async StoreGammedData(@Req() req,)
	{
		
	}
}
