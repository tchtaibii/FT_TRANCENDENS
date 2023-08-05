import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-guard';
import { GameDto } from './gameDto';
import { ApiBody, ApiTags } from "@nestjs/swagger";
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { GameService } from './game.service';

@Controller('game')
@UseGuards(JwtAuthGuard)
@ApiTags('game')
export class GameController {
    constructor(private readonly GameService : GameService){}
	
	@Post('StoreData')
	async StoreGameData(@Req() req, @Body() Data : GameDto)
	{
		// console.log('here', req.user);
		await this.GameService.storeGame(req.user, Data);
	}
}
