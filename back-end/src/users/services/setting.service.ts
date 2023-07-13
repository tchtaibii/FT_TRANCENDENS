import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { setting } from '../dto/dto-classes';

@Injectable()
export class SettingService {
    prisma = new PrismaClient();
	constructor(){}

    async getSettinginfromations(User : User)
    {
        const infos : setting = await this.prisma.user.findUnique({
            where : 
            {
                UserId : User.UserId,
            },
            select :
            {
                avatar : true,
                username : true,
                email : true,
            }
        });
        return infos;
    }
}
