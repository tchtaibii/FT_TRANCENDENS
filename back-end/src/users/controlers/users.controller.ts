import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-guard';
import { UsersService } from '../services/users.service';
import {UserDTO, GamesDTO, AllGames, topPlayers, notification} from '../dto/dto-classes'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly UserService : UsersService){}

	@Get('getNotification')
	async getNotification(@Req() req)
	{
		return await this.UserService.getNotification(req.user);
	}

	@Post('search')
	@ApiBody({ 
		schema: {
			type: 'object',
			properties: {
			user: {
				type: 'string',
			},
			},
		},
	})
	async search(@Req() req, @Body("user") user : string, @Res() res)
	{
		const allusers = await this.UserService.getallUsers(req.user, user);
		res.json(allusers);
	}

	@Post("ReadNotification")
	@ApiBody({ 
		schema: {
			type: 'object',
			properties: {
			notificationId: {
				type: "number",
			},
			},
		},
	})
	async ReadNotification(@Body("notificationId") notificationId : number, @Req() req, )
	{
		await this.UserService.ReadNotification(notificationId, req.user);
	}

	@Post("readallnotification")
	async ReadAllNotification(@Req() req)
	{
		return await this.UserService.ReadallNotification(req.user);
	}

}
