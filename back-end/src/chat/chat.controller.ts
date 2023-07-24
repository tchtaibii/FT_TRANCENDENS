<<<<<<< HEAD
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AddUsers, RoomDto } from './dto';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-guard';

@Controller('chat')
@ApiTags('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly ChatService : ChatService)
    {}

    @Post('createRoom')
    @ApiBody({ type: RoomDto }) 
    async CreateRoom(@Body() room : RoomDto, @Req() req)
    {
        const Room = await this.ChatService.createRoom(room, req.user);
        return Room.RoomId;
    }

    @Get(':RoomId/Conversation')
    async getRoom(@Req() req, @Param('RoomId', ParseIntPipe) roomId : number)
    {
        return await this.ChatService.getConversation(roomId, req.user.UserId);
    }

    // @Post(":RoomId/SendMessage")
    // @ApiBody({ 
    //     schema: {
    //       type: 'object',
    //       properties: {
    //         content: {
    //           type: 'string',
    //         },
    //       },
    //     },
    // })
    // async sendMessage(@Req() req, @Body('content') content : string, @Param('RoomId', ParseIntPipe) RoomId : number)
    // {
    //     await this.ChatService.sendMessage(content, req.user, RoomId);
    // }

    @Get('GetRooms')
    async getRooms(@Req() req)
    {
      return await this.ChatService.getRooms(req.user);
    }

    @Delete(':RoomId/DeleteRoom')
    async DeleteRoom(@Req() req, @Param("RoomId", ParseIntPipe) RoomId : number)
    {
        return await this.ChatService.DeleteRoom(req.user, RoomId);
    }

	@Post(':RoomId/AddUser')
	async addUser(@Req() req, @Param("roomId", ParseIntPipe) roomId : number, @Body() users : string[])
	{
        await this.ChatService.addUser(req.user, roomId, users);
	}

	@Delete(':RoomId/RemoveUser')
	removeUser(@Req() req, @Param("roomId", ParseIntPipe) roomId : number)
	{
        
	}
}
=======
import { Controller } from '@nestjs/common';

@Controller('chat')
export class ChatController {}
>>>>>>> 46d7dd454019aefa009a489adde17392b1e36081
