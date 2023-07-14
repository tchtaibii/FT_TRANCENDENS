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
        res.redirect(process.env.FrontIp + '/login');
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
    @Patch('updateUsername')
    async updateUsername(@Body('username') newUsername: string, @Req() req)
    {
        return await this.SettingService.updateUsername(newUsername, req.user);
    }

    @Post('UpdatePicture')
    @UseInterceptors(FileInterceptor('file'))
    async UpdateProfile(@UploadedFile() file, @Req() req)
    {
        console.log("hashshasha");
        return await this.SettingService.updatePhoto(file, req.user);
    }
}
