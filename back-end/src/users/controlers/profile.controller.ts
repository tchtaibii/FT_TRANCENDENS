import { Body, ConsoleLogger, Controller, Get, NotFoundException, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-guard';
import { UsersService } from '../services/users.service';
import {UserDTO, GamesDTO, AllGames, topPlayers} from '../dto/dto-classes'
import { ProfileService } from '../services/profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiTags } from '@nestjs/swagger';



@Controller('Profile')
@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly ProfileService : ProfileService){}

    @Get(':username/gamehistory')
    async getGameHistory(@Req() req, @Res() res, @Param('username') username : string)
	{	
        // console.log(username);
		const user = await this.ProfileService.ReturnOneUserByusername(username);
		if (!user)
			throw new NotFoundException('User profile not found');
        let game : AllGames = await this.ProfileService.fetchgame(user);
        res.json(game);
    }

    @Get(':username/profile')
    async getProfile(@Req() req, @Res() res, @Param('username') username : string){
        // var blocked;
        // console.log("hahaha\n");
        const user = await this.ProfileService.ReturnOneUserByusername(username);
        // if (user.UserId !== req.user.UserId)
        //     blocked = await this.ProfileService.isBlocked(user, req.user);
		// if (blocked || !user)
		// 	throw new NotFoundException('User profile not found');
        // console.log("here\n");
        const Isowner = user.username === req.user.username;
        let isFriend = false;
        if (!Isowner)
            isFriend = await this.ProfileService.checkisfriend(user, req.user);
        res.json({
            avatar 	 : user.avatar,
            status 	 : user.status,
            level  	 : user.level,
            xp       : user.XP,
            username : user.username,
            Isowner,
            isFriend,
        });
    }

	@Get(':username/Friends')
	async getFriends(@Req() req, @Res() res, @Param('username') username : string)
	{
		const user = await this.ProfileService.ReturnOneUserByusername(username);
		if (!user)
			throw new NotFoundException('User profile not found');
		const friends = await this.ProfileService.userFriends(user, req.user);
		res.json(friends);
	}

    @Post('blockUser')
    @Post('CancelRequest')
    @ApiBody({ 
        schema: {
          type: 'object',
          properties: {
            blockedUser: {
              type: 'string',
            },
          },
        },
    })
    async blockUser(@Req() req, @Body('blockedUser') username : string)
    {
        const user = await this.ProfileService.ReturnOneUserByusername(username);
        if (!user)
            throw new NotFoundException('User profile not found');
        const blocked = await this.ProfileService.blockUser(req.user, user);
    }
}
