import { All, Injectable } from '@nestjs/common';
import { PrismaClient, User, Game, notificationType } from '@prisma/client';
import { GamesDTO, AllGames, topPlayers, RecentActivity, ProfileFriends, blockedlist, request } from '../dto/dto-classes';
import { create } from 'domain';
import { type } from 'os';
import { NotificationGateway } from 'src/events/notification/notification.gateway';

@Injectable()
export class FriendshipService {
    prisma = new PrismaClient();
	constructor(){}

    async sendRequest(User : User, receiverId : string)
    {
        const existingRequest = await this.prisma.friendship.findFirst({
            where: {
                SenderId: User.UserId,
                ReceiverId: receiverId
            }
        });

        if (existingRequest)
            return true;

        await this.prisma.friendship.create ({
            data: {
                sender: {
                connect: { UserId: User.UserId }
                },
                receiver: {
                connect: { UserId: receiverId }
                },
            }
        });

        // const notification =  await this.prisma.notification.create({
        // 	data: {
        // 		UserId: receiverId,
        // 		Type: notificationType.friendship_request, 
        // 		isRead: false,
        // 	  },
        // })
        // NotificationGateway
	}

	async AcceptRequest(FriendshipId : number)
	{
		const friend = await this.prisma.friendship.update({
			where: { FriendshipId : FriendshipId,  },
			data: { Accepted : true},
		});

		const notification =  await this.prisma.notification.create({
			data: {
				UserId: friend.SenderId,
				Type: notificationType.Accepted_request, 
				isRead: false,
			  },
		})
	}


	async cancelRequest(FriendshipId : number)
	{
		const friendship = await this.prisma.friendship.delete({
			where: {
			  FriendshipId: FriendshipId
			},
		});
		return true;
	}

    async getFriendshipRequest(User : User)
    {
        const request = await this.prisma.friendship.findMany({
            where : {
                ReceiverId : User.UserId,
                Accepted : false,
            },
            select : {
                FriendshipId : true,
                sender : {
                    select : {
                        UserId : true,
                        avatar : true,
                        username : true,
                    }
                }
            }
        });

        console.log(request);

        const friendshipRequest  = request.map((user) => {
            user.sender.avatar = user.sender.avatar.search("https://cdn.intra.42.fr/users/") === -1 ? process.env.HOST + process.env.PORT + user.sender.avatar : user.sender.avatar;
            return {
                friendshipId : user.FriendshipId,
                UserId : user.sender.UserId,
                avatar : user.sender.avatar,
                username : user.sender.username,
            }
        })
        return friendshipRequest;
    }
}

