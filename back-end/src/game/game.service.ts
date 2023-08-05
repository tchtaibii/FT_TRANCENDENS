import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { GameDto } from './gameDto';

@Injectable()
export class GameService {

	constructor(
		private readonly prisma: PrismaClient,
	) { }

	async calcullevel(User : User, Data)
	{
		let { level, XP } = User;

		if (Data.WinnerId === User.UserId)
		{
			if (XP + 120 <= (level + 1) * 200)
				XP += 120;
			else
			{
				level += 1;
				XP = (XP + 120) - (200 * level + 1);
			}
		}
		else
		{
			if (XP - 120 >= 0)
				XP -= 120;
			else
			{ 
				level -= 1;
				XP = (level * 200) - (120 - XP);
			}
		}

		return {level, XP};
	}

	async storeGame(User : User, Data : GameDto)
	{
		const { level, XP } = await this.calcullevel(User, Data);

		await this.prisma.$transaction(async (prisma) => {
			await prisma.game.create({
				data : {
					PlayerId1 : Data.PlayerId1,
					PlayerId2 : Data.PlayerId2,
					WinnerId : Data.WinnerId,
					Mode : Data.Mode,
					WinnerXP : Data.WinnerXP,
					looserXP : Data.looserXP,
					Rounds : 1,
				},
			})
			await prisma.user.update({
				where : {
					UserId : User.UserId
				},
				data : {
					level : level,
					XP : XP,
				}
			})

		})

		this.checkAchievement(User);
	}

	async checkAchievement(User : User)
	{
		const achievement = await this.prisma.achievement.findFirst({
			where : {UserId : User.UserId},
		})

		var PongPlayer = false;
		var Helmchen = false;
		var Worldcup = false;

		if (!achievement.Helmchen)
		{
			const HelmchenTest = await this.prisma.game.count({
				where : {
					WinnerId : User.UserId
				}
			});
		
			Helmchen = HelmchenTest === 10 ? true : false;
		}

		if (!achievement.Worldcup)
		{
			const WorldcupCheck = await this.prisma.game.count({
				where : {
					OR : [
						{PlayerId1 : User.UserId} , {PlayerId2 : User.UserId}
					],
					Mode : "football",
				}
			})
			Worldcup = WorldcupCheck === 7 ? true : false;
		}

		if (achievement.PongPlayer)
		{
			const PongPlayerCheck = await this.prisma.game.count({
				where : {
					OR : [
						{PlayerId1 : User.UserId} , {PlayerId2 : User.UserId}
					],
				}
			})

			PongPlayer = PongPlayerCheck !== 0 ? true : false;
		}
		
		await this.prisma.achievement.update({
			where : {
				UserId : User.UserId,
			},
			data : {
				PongPlayer : PongPlayer,
				Worldcup : Worldcup,
				Helmchen : Helmchen,
			}
		})
	}
}
