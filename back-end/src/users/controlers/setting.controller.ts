import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { SettingService } from '../services/setting.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-guard';

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

}
