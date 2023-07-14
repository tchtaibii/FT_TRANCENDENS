import { Body, Controller, Get, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SettingService } from '../services/setting.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('setting')
@ApiTags('Setting')
@UseGuards(JwtAuthGuard)
export class SettingController {
    constructor(private readonly SettingService : SettingService){}

    @Get("account")
    async settingAccount(@Req() req, @Res() res){
        const infos = await this.SettingService.getSettinginfromations(req.user);
        res.json(infos);
    }

    @Get('blockedlist')
    async getBlockedlist(@Req() req, @Res() res)
    {
        const list = await this.SettingService.getBlockedlist(req.user);
        res.json(res);
    }

    @Post("DeleteAccount")
    async DeleteAccount(@Res() res, @Req() req)
    {
        await this.SettingService.removeAccount(res, req.user);
    }

    @ApiBody({ 
        schema: {
          type: 'object',
          properties: {
            usernmae: {
              type: 'string',
            },
          },
        },
    })

    @Post('updateInfo')
    @UseInterceptors(FileInterceptor('file'))
    async updateUsername(@Body('username') newUsername: string, @Req() req, @UploadedFile() file?)
    {
        console.log("m in");
        // await this.SettingService.updateUsername(newUsername, req.user);
        // if (file)
        // {
            console.log("here");
            await this.SettingService.updatePhoto(file, req.user);
        // }
        return true;
    }

    // @Post('UpdatePicture')
    // async UpdateProfile(@UploadedFile() file, @Req() req)
    // {
    //     return
    // }

    @Get("status")
    async getStatus(@Req() req)
    {
        return await this.SettingService.getStatus(req.user);
    }

    @Post("updateStatus")
    async updateStatus(@Req() req)
    {
        return await this.SettingService.updateStatus(req.user);
    }
}
