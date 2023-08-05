import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-guard';
import { GameDto } from './gameDto';

@Controller('game')
@UseGuards(JwtAuthGuard)
@ApiTags('friendship')
export class GameController {
    constructor(){}
	
	@Post('StoreData')
	async StoreGameData(@Req() req, Data : GameDto)
	{
		
	}
}
