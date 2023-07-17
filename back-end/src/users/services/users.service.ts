import { All, Injectable } from '@nestjs/common';
import { PrismaClient, User, Game, notificationType, Prisma } from '@prisma/client';
import { GamesDTO, AllGames, topPlayers, RecentActivity, ProfileFriends, blockedlist, notification } from '../dto/dto-classes';
import { create } from 'domain';
import { type } from 'os';
import { NotificationGateway } from 'src/events/notification/notification.gateway';


@Injectable()
export class UsersService {
	prisma = new PrismaClient();
	constructor(){}
    

    async	createUser(user : User){
		const newUser = await this.prisma.user.create({
			data: user,
		});
		return newUser;
	}

    async findOneUser(user : User){
		const findUser = await this.prisma.user.findUnique({
			where: {
				UserId: user.UserId,
			},
		});
		if (!findUser){
			return false;
		}
		return true;
    }


	async ReturnOneUser(user : User){
		const findUser = await this.prisma.user.findUnique({
			where: {
				email: user.email,
			},
		});
		if (!findUser){
			return findUser;
		}
		return findUser;
    }

	async updateUser(email, updatedObject)
	{
		try {
		const updatedUser = await this.prisma.user.update({
			where: { email: email },
			data: updatedObject
		  });
		  return updatedUser;
		}
		 catch (error) {
		  console.error("Error updating user:", error);
		  return null;
		}
	}

	async getNotification(User : User)
	{
		const blocks = await this.getBlockeduserIds(User);

		const notification = await this.prisma.notification.findMany({
			where : {
				receiverId : User.UserId,
			},
			select : 
			{
				NotificationId : true,
				senderId : true,
				Type : true,
				isRead : true,
				sender : {
					select : {
						username : true,
						avatar : true,
						UserId : true,
					}
				}
			}
		});

		const notifications = notification.filter(user => !blocks.includes(user.senderId));

		const final : notification[] = notifications.map(user => {
			return {
				avatar : user.sender.avatar,
				username : user.sender.username,
				isRead : user.isRead,
				notificationId : user.NotificationId,
				Type : user.Type,
			}
		})
		return final;
	}

	async getBlockeduserIds(user : User)
	{
		const blockedUser = await this.prisma.friendship.findMany({
			where : {
				OR : [
					{
						SenderId : user.UserId,
						OR : [
								{blockedBySender : true},
								{blockedByReceiver : true},
						]
					},
					{
						ReceiverId : user.UserId,
						OR : [
							{blockedBySender : true},
							{blockedByReceiver : true},
						]
					},	
				]
			},
			select : {
				SenderId : true,
				ReceiverId : true,
			}
		});

		const blockedUserIds = blockedUser.map(friendship =>
			friendship.SenderId === user.UserId ? friendship.ReceiverId : friendship.SenderId
		);
	
		return blockedUserIds;
	}


	async getallUsers(User : User, username)
	{
		const blocked = await this.getBlockeduserIds(User);

		const user = await this.prisma.user.findMany({
			where : {
				OR : 
				[
					{
						username :{
							startsWith : username,
							mode : 'insensitive',
						}
					},
					{
						FullName : {
							startsWith : username,
							mode : 'insensitive',
						}
					}
				]
			}
		})

		const users = user.filter(filter => !blocked.includes(filter.UserId));

		const isFriend = await this.prisma.friendship.findMany({
			where : {
				OR : [
					{
						SenderId : User.UserId,
					},
					{
						ReceiverId : User.UserId,
					}
				],
				Accepted : true,
				blockedByReceiver : false,
				blockedBySender : false,
			},
			select : {
				sender : {
					select : 
					{
						UserId : true,
					}
				},
				receiver : {
					select : {
						UserId : true,
					}
				}
			},
		})

		const friends = isFriend.map(friend => {
			return friend.sender.UserId !== User.UserId ? friend.sender.UserId : friend.receiver.UserId;
		})

		const fetchusers = users.map((user) => {
			user.avatar = user.avatar.search("https://cdn.intra.42.fr/users/") === -1 ? process.env.HOST + process.env.PORT + user.avatar : user.avatar;
			const check = friends.includes(user.UserId);
			return {
				UserId : user.UserId,
				avatar : user.avatar,
				username : user.username,
				level : user.level,
				badge : user.badge,
				status : user.status,
				isFriend : check,
			}
		})
		return fetchusers;
	}

	async ReadNotification(notificationId : number, User : User)
	{
		await this.prisma.notification.update({
			where : {NotificationId : notificationId},
			data : {isRead : true,}
		})
	}

	async ReadallNotification(User : User)
	{
		await this.prisma.notification.updateMany({
			where : {receiverId : User.UserId},
			data : {isRead : true},
		})
		return true;
	}
}
