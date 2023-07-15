import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, User, } from '@prisma/client';
import { GamesDTO, ProfileFriends } from '../dto/dto-classes';
import { join } from 'path';
import { ConflictException } from '@nestjs/common';



@Injectable()
export class ProfileService {
    prisma = new PrismaClient();
	constructor(){}

    async ReturnOneUserByusername(username : string){
		const findUser = await this.prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (!findUser){
			return findUser;
		}
		return findUser;
    }

	async getProfile(User : User, username)
	{
		var blocked;
		const user = await this.ReturnOneUserByusername(username);
		if (user.UserId !== User.UserId)
		    blocked = await this.isBlocked(user, User);
		if (blocked || !user)
			throw new NotFoundException('User profile not found');
		console.log(blocked);
		const Isowner = user.username === User.username;
		var isSent = false;
		var isFriend = false;
		var friend;
		if (!Isowner)
		{
			friend = await this.checkisfriend(user, User);
			isSent = friend.length ? true : false;
			isFriend = isSent ? friend[0].Accepted : false;
		}

		return ({
			UserId   : user.UserId,
			avatar 	 : user.avatar,
			status 	 : user.status,
			level  	 : user.level,
			xp       : user.XP,
			username : user.username,
			Isowner,
			isSent,
			isFriend,
		});
	}

	async blockUser(user : User, targetUser : User)
	{
		var friend = await this.prisma.friendship.findFirst({
			where : {
				OR :[
					{
					SenderId : user.UserId, ReceiverId : targetUser.UserId
				},
				{
					SenderId : targetUser.UserId, ReceiverId : user.UserId,
				}
			]
			}
		})

		if (!friend)
		{
			friend = await this.prisma.friendship.create({
				data : {
					SenderId : user.UserId,
					ReceiverId : targetUser.UserId,
					blockedBySender : true,
				}
			})
			return friend;
		}
		if (friend.SenderId === user.UserId)
		{
			await this.prisma.friendship.update({
				where : {
					FriendshipId : friend.FriendshipId,
				},
				data : {
					blockedBySender : true,
					Accepted : false,
				}
			})
		}
		else
		{
			await this.prisma.friendship.update({
				where : {
					FriendshipId : friend.FriendshipId,
				},
				data : {
					blockedByReceiver : true,
					Accepted : false,
				}
			})
		}
	}
    
    async userFriends(user : User, authUser : User)
	{
		const blocked = await this.getBlockeduserIds(authUser);

		const friendsInfo1 = await this.prisma.friendship.findMany({
			where : {
				AND : [
					{
						OR: [{SenderId : user.UserId}, {ReceiverId : user.UserId}]
					},
				],
				blockedByReceiver : false,
				blockedBySender : false,
			},
			select : {
				Accepted : true,
				FriendshipId : true,
				sender : {
					select : {
						avatar : true,
						username : true,
						UserId : true,
					}
				},
				receiver : {
					select : {
						avatar : true,
						username : true,
						UserId : true,
					}
				}
			}
		});

		var friendsInfo = friendsInfo1.filter(authUser => !blocked.includes(authUser.receiver.UserId));

		friendsInfo = friendsInfo.filter(authUser => !blocked.includes(authUser.sender.UserId));

		if (user.UserId !== authUser.UserId)
		{
			let friendsInfo2 = await this.prisma.friendship.findMany({
				where : {
					AND : [
						{
							OR: [{SenderId : authUser.UserId}, {ReceiverId : authUser.UserId}]
						},				
					],
					blockedByReceiver : false,
					blockedBySender : false,
				},
				select : {
					FriendshipId : true,
					Accepted : true,
					sender : {
						select : {
							avatar : true,
							username : true,
							UserId : true,
						}
					},
					receiver : {
						select : {
							avatar : true,
							username : true,
							UserId : true,
						}
					}
				}
			});

			var friend2;
			var accepted = false;
			const afriends = friendsInfo.map((friendship) => {
				const friend = friendship.sender.username === user.username ? friendship.receiver : friendship.sender;
					if (friend.username !== authUser.username)
					{
						const isMutual = friendsInfo2.some((friendship) => {
							friend2 = friendship.sender.UserId === authUser.UserId ? friendship.receiver : friendship.sender;
							accepted = friendship.sender.UserId === authUser.UserId ? friend2.accepted : false;
							return friend.UserId === friend2.UserId;
						});
						return {
							friendshipId : friendship.FriendshipId,
							UserId	: friend.UserId,
							avatar : friend.avatar,
							username : friend.username,
							Accepted : accepted,
							sentInvitation : isMutual,
							isOwner : false,
						}
					}
					else
					{
						if (friendship.Accepted)
							return {
								UserId	: friend.UserId,
								avatar : friend.avatar,
								username : friend.username,
								Accepted : true,
								sentInvitation : false,
								isOwner : true,
							}
					}
					
			}).filter((friend) => friend !== undefined);

			return afriends;
		}
		else if (user.UserId === authUser.UserId)
		{
			const friends : ProfileFriends[] = friendsInfo.map((friendsInfo) => {
				const check = friendsInfo.sender.UserId === user.UserId ? friendsInfo.receiver : friendsInfo.sender;
				if (friendsInfo.Accepted)
					return {
						friendshipId : friendsInfo.FriendshipId,
						UserId : check.UserId,
						avatar : check.avatar,
						username : check.username,
						sentInvitation : true,
						Accepted : true,
						isOwner : false,
					}
			}).filter((frienship) => frienship !== undefined);
			return friends;
		}
	}

    async checkisfriend(user : User, AuthUser : User)
	{
		const friend = await this.prisma.friendship.findMany({
			where :
			{
				AND : [
					{
						OR: [{SenderId : user.UserId, ReceiverId : AuthUser.UserId},
							{SenderId : AuthUser.UserId, ReceiverId : user.UserId},]
					},
					{
						Accepted : true,
					}
				]
			},
			take : 1,
		});
		friend.filter((friend) => friend !== undefined);
		// console.log(friend);
		return friend;
	}
    
	async isBlocked(user : User, AuthUser : User)
	{
		const isBlocked = await this.prisma.friendship.findFirst({
			where : {
				OR : [
					{
						SenderId : user.UserId, ReceiverId : AuthUser.UserId, blockedBySender : true,
					},
					{
						SenderId : user.UserId, ReceiverId : AuthUser.UserId, blockedByReceiver : true,
					},
					{
						SenderId : AuthUser.UserId, ReceiverId : user.UserId, blockedByReceiver : true,
					},
					{
						SenderId : AuthUser.UserId, ReceiverId : user.UserId, blockedBySender : true,
					}
				],
			}
		});
		console.log(isBlocked);
		return isBlocked === null;
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

	async countGames(games, user, blockedUserIds)
	{
		const Draw = await this.prisma.game.count({
			where:{
				isDraw: true,
				OR: [
						{ 
							PlayerId1: user.UserId, 
							PlayerId2: { not: { in: blockedUserIds } },
						},
						{ 
							PlayerId2: user.UserId, 
							PlayerId1: { not: { in: blockedUserIds } },
						},
				  ],
			}
		});

		const win = await this.prisma.game.count({
			where:{
				WinnerId: user.UserId,
				OR: [
						{ 
							PlayerId1: user.UserId, 
							PlayerId2: { not: { in: blockedUserIds } },
						},
						{ 
							PlayerId2: user.UserId, 
							PlayerId1: { not: { in: blockedUserIds } },
						},
				],
			}
		});

		const loose = games.length - (win + Draw);

		return {
			loose,
			Draw,
			win
		};
	}

	async Allgames(user, blockedUserIds)
	{
		let games = await this.prisma.game.findMany({
			where: {
				OR: [
					{ 
					  PlayerId1: user.UserId, 
					  PlayerId2: { not: { in: blockedUserIds } },
					},
					{ 
					  PlayerId2: user.UserId, 
					  PlayerId1: { not: { in: blockedUserIds } },
					},
				  ],
			},
			orderBy:{
				CreationTime : "desc"
			}
		})
		return games;
	}

	async fetchgame(user : User, authUser : User)
	{
		const blockedUserIds = await this.getBlockeduserIds(authUser);
		
		let games1 = await this.Allgames(user, blockedUserIds);

		var games = games1.filter(gameUser => !blockedUserIds.includes(gameUser.PlayerId1));

		games = games.filter(user => !blockedUserIds.includes(user.PlayerId2));

		const count = this.countGames(games, user, blockedUserIds);
	
		let AllGames : GamesDTO [] = [];

		let isadv;

		for (let i = 0; i < games.length; i++){

			let { GameId, Mode, isDraw, Rounds, WinnerXP, looserXP } = games[i];

			let won = games[i].WinnerId === user.UserId ? true : false;

			isadv = games[i].PlayerId1 === user.UserId ? games[i].PlayerId2 : games[i].PlayerId1;
		
			let adv = await this.prisma.user.findUnique({
				where : {
					UserId : isadv,
				}
			});

			let Game: GamesDTO = {
				GameId: GameId.toString(),
				Mode: Mode,
				isDraw: isDraw,
				Rounds: Rounds,
				won: won,
				advPic : adv.avatar,
				AdvName: adv.username,
				Winnerxp : WinnerXP,
				looserxp : looserXP,
			};
			AllGames.push(Game);
		}
	
		return {
			win : (await count).win,
			loose : (await count).loose,
			Draw : (await count).Draw,
			AllGames
		};
	}




}
