import { Body, ConflictException, HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { blockedlist, setting } from '../dto/dto-classes';
import { join } from 'path';
import { promises as fs, stat } from 'fs';
import { async } from 'rxjs';


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

    async getBlockedlist(User : User)
	{
		var blockedlist : blockedlist [] = [];
		const blockedBySender = await this.prisma.friendship.findMany({
			where : {
					SenderId: User.UserId,
					blockedBySender : true,
				},
			select : {
				receiver :
				{
					select : {
						UserId : true,
						username : true,
						avatar : true,
					}
				}
			}
		});

		blockedBySender.map((friend) => {
			const { avatar, UserId, username} = friend.receiver;
			blockedlist.push({
				avatar : avatar,
				username : username,
				UserId : UserId,
			})
		});

		const blockedByreceiver = await this.prisma.friendship.findMany({
			where : {
					ReceiverId: User.UserId,
					blockedByReceiver : true,
				},
			select : {
				sender:
				{
					select : {
						UserId : true,
						username : true,
						avatar : true,
					}
				}
			}
		});

		blockedByreceiver.map((friend) => {
			const { avatar, UserId, username} = friend.sender;
			blockedlist.push({
				avatar : avatar,
				username : username,
				UserId : UserId,
			})
		});

		return blockedlist; 
	}

    async removeAccount(@Res() res, User : User)
	{
        await this.prisma.$transaction(async (prisma) => {
            await this.prisma.game.deleteMany({where : {
                OR : [
                    {PlayerId1 : User.UserId},
                    {PlayerId2 : User.UserId},
                ]
            }}),
            await this.prisma.friendship.deleteMany({
                where : {
                    OR : [
                        {SenderId : User.UserId},
                        {ReceiverId : User.UserId},
                    ]
                }
            }),
            await this.prisma.notification.deleteMany({
                where :{
                    UserId : User.UserId,
                }
            })
            await this.prisma.membership.deleteMany({
                where : {
                    UserId : User.UserId,
                }
            }),
            await this.prisma.message.deleteMany({
                where: {
                    UserId : User.UserId,
                }
            })
            await this.prisma.user.delete({where : { UserId : User.UserId}})
        });
		res.clearCookie('access_token');
		res.clearCookie('refresh_token');
		res.clearCookie('isAuthenticated');
		res.redirect(process.env.FrontIp + '/login');
	}

    async updateUsername(newUsername : string, User : User)
	{
        const usernamePattern = /^[a-zA-Z0-9]+$/;

        if (newUsername.length < 5 || newUsername.length > 10 || !usernamePattern.test(newUsername))
            throw new HttpException("Error in username", HttpStatus.BAD_REQUEST);

		const exist = await this.prisma.user.findUnique({
			where : {username : newUsername},
		});

        if (newUsername == User.username)
            return true;
		else if (exist)
			throw new ConflictException('Username is already in use');

		const picture = await this.prisma.user.update({
			where: { UserId : User.UserId },
			data : { username : newUsername },
		})

		return true;
	}

    async updatePhoto(file, User : User)
	{
		const filename = `${User.username}-${file.originalname}`;
        const path = join(__dirname, '../../../uploads', filename);
		console.log(path);
        await fs.writeFile(path, file.buffer);
		const pathPicture = process.env.HOST + process.env.PORT + '/uploads' + filename;
		const picture = await this.prisma.user.update({
			where: { UserId : User.UserId },
			data : { avatar : pathPicture },
		})
		return true;
	}

    async getStatus(User : User)
    {
        const status = await this.prisma.user.findUnique({
            where :{ UserId : User.UserId},
            select : {status : true},
        })
        return status;
    }

    async updateStatus(user : User)
    {
        const status = this.prisma.user.findUnique({
            where : { UserId : user.UserId },
            select : { status : true }
        });
        
        await this.prisma.user.update({
            where : { UserId : user.UserId},
            data : { status : !status }
        })
        return !status;
    }
}