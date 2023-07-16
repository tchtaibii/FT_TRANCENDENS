import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-guard';
import { UsersService } from '../services/users.service';
import {UserDTO, GamesDTO, AllGames, topPlayers} from '../dto/dto-classes'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('Request')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly UserService : UsersService){}

    @Get('getNotification')
    async getNotification(@Req() req)
    {
		  // this.UserService.getNotification(req.user);
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
    console.log(user);
    res.json(allusers);
	}

    // @Get('Get-Notification')
    // getNotification()
    // {
      
    // }
}
