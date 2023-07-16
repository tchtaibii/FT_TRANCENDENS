import { All, Injectable } from '@nestjs/common';
import { PrismaClient, User, Game, notificationType } from '@prisma/client';
import { GamesDTO, AllGames, topPlayers, RecentActivity, ProfileFriends, blockedlist } from '../dto/dto-classes';
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

	// async getNotification(User : User)
	// {
	// 	// const notification 
	// }

	async getallUsers(User : User, username)
	{
		const users = await this.prisma.user.findMany({
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
}
