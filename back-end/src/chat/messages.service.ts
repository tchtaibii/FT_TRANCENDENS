import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto, MessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { PrismaClient, User } from '@prisma/client';
import { CreateMembershipDto, CreateRoomDto } from './dto/room.dto';
import { StringDecoder } from 'string_decoder';
import * as bcrypt from 'bcrypt'

@Injectable()
export class MessagesService {

    constructor(private readonly prisma: PrismaClient) { }

    async createRoom(createRoomDto: CreateRoomDto) {

        const { name, password, type } = createRoomDto;
        if (type == 'protected') {
            if (!password)
                throw new NotFoundException('password makaynch');
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const room = await this.prisma.room.create({
                    data: {
                        RoomNAme: name,
                        ischannel: true,
                        Password: hashedPassword,
                        Type: type, //protected //private //public
                    },
                });
                return room;
            }
        }
        else {
            const room = await this.prisma.room.create({
                data: {
                    RoomNAme: name,
                    ischannel: true,
                    Password: '',
                    Type: type,
                },
            });
            return room;
        }
    }
    async createMembership(roomId: number, userId: string) {
        const membership = await this.prisma.membership.create({
            data: {
                room: { connect: { RoomId: roomId } },
                member: { connect: { UserId: userId } },
                Role: 'Owner', //member //admin
                isBanned: false,
                isMuted: false,
            },
        });

        return membership;
    }

    async storeMessage(messageDto: MessageDto) {
        const { roomId, userId, Content } = messageDto;

        const texts = await this.prisma.message.create({
            data: {
                room: { connect: { RoomId: roomId } },
                user: { connect: { UserId: userId } },
                Content: Content,
            },
        });
        return texts;
    }

    async deleteRoom(roomId: number, userId: string) {

        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { RoomId: roomId },
                    { UserId: userId },
                ],
            },
        });

        if (!membership)
            throw new UnauthorizedException('Membership doesnt exist');

        if (membership.Role !== 'Owner') {
            throw new UnauthorizedException('u dont have the right to delete room');
        }


        await this.prisma.message.deleteMany({
            where: {
                room: { RoomId: roomId },
            },
        });
        await this.prisma.membership.deleteMany({
            where: {
                room: { RoomId: roomId },
            },
        });

        return this.prisma.room.delete({
            where: {
                RoomId: roomId,
            },
        });

    }

    async kickFromRoom(roomId: number, userId: string, userIDmin: string) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { RoomId: roomId },
                    { UserId: userIDmin },
                ],
            },
        });

        if (!membership)
            throw new UnauthorizedException('Membership doesnt exist');

        if (membership.Role !== 'Owner' && membership.Role !== 'Admin') {
            throw new UnauthorizedException('u dont have the right to kick');
        }

        await this.prisma.membership.deleteMany({
            where: {
                RoomId: roomId,
                UserId: userId,
            },
        });
    }

    async leaveRoom(roomId: number, userId: string) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { RoomId: roomId },
                    { UserId: userId },
                ],
            },
        });
        if (!membership)
            return { message: 'membership doesnt found' };
        if (membership.Role === 'Owner') {
            const roommembers = await this.prisma.membership.findMany({
                where: {
                    RoomId: roomId,
                },
            });

            if (roommembers.length > 1) {
                const membersfindinroom = roommembers.filter((member) => member.UserId !== userId);
                const randomuser = Math.floor(Math.random() * membersfindinroom.length);
                const newowner = membersfindinroom[randomuser];
                await this.prisma.membership.update({
                    where: {
                        MembershipId: newowner.MembershipId
                    },
                    data: {
                        Role: 'Owner'
                    },
                });
            }
        }
        await this.prisma.membership.deleteMany({
            where: {
                RoomId: roomId,
                UserId: userId,
            },
        });
    }

    async addMemberToRoom(roomId: number, username: string, userIDmin: string) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { RoomId: roomId },
                    { UserId: userIDmin },
                ],
            },
        });

        if (!membership)
            throw new UnauthorizedException('Membership doesnt exist');

        if (membership.Role !== 'Owner' && membership.Role !== 'Admin') {
            throw new UnauthorizedException('u dont have the right to add');
        }

        const member = await this.prisma.user.findUnique({
            where : {
                username : username,
            }
        })
        if (!member)
            throw new NotFoundException('not found');

        const checkmember = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { RoomId: roomId },
                    { UserId: member.UserId },
                ],
            },
        });


        if (checkmember || (checkmember && checkmember.isBanned)) {
            throw new NotFoundException('User deja kayen f room!');
        }

        const addmembership = await this.prisma.membership.create({
            data: {
                RoomId: roomId,
                UserId: member.UserId,
                isBanned: false,
                isMuted: false,
                Role: 'Member',
            },

        });

        return addmembership;
    }

    async muteMember(userId: string, membershipId: number, roomid: number) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { UserId: userId },
                ],
            },
        });

        if (!membership) {
            throw new UnauthorizedException('Membership does not exist.');
        }

        if (membership.Role !== 'Owner' && membership.Role !== 'Admin') {
            throw new UnauthorizedException("You don't have the right to mute.");
        }

        await this.prisma.membership.update({
            where: {
                RoomId: roomid,
                MembershipId: membershipId,
            },
            data: {
                isMuted: true,
            },
        });
    }

    async BannedMember(userId: string, membershipId: number, roomid: number) {

        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { UserId: userId },
                ],
            },
        });

        if (!membership) {
            throw new UnauthorizedException('Membership does not exist.');
        }

        if (membership.Role !== 'Owner' && membership.Role !== 'Admin') {
            throw new UnauthorizedException("You don't have the right to ban.");
        }

        await this.prisma.membership.update({
            where: {
                RoomId: roomid,
                MembershipId: membershipId,
            },
            data: {
                isBanned: true,
            },
        });
        await this.prisma.membership.deleteMany({
            where: {
                RoomId: roomid,
                UserId: userId,
            },
        });

    }

    async unmuteMember(userId: string, membershipId: number, roomid: number) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { UserId: userId },
                ],
            },
        });

        if (!membership) {
            throw new UnauthorizedException('Membership does not exist.');
        }

        if (membership.Role !== 'Owner' && membership.Role !== 'Admin') {
            throw new UnauthorizedException("You don't have the right to mute.");
        }

        await this.prisma.membership.update({
            where: {
                RoomId: roomid,
                MembershipId: membershipId,
            },
            data: {
                isMuted: false,
            },
        });
    }

    async unBannedMember(userId: string, membershipId: number, roomid: number) {

        const membership = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { UserId: userId },
                ],
            },
        });

        if (!membership) {
            throw new UnauthorizedException('Membership does not exist.');
        }

        if (membership.Role !== 'Owner' && membership.Role !== 'Admin') {
            throw new UnauthorizedException("You don't have the right to ban.");
        }

        await this.prisma.membership.update({
            where: {
                RoomId: roomid,
                MembershipId: membershipId,
            },
            data: {
                isBanned: false,
            },
        });
    }

    async getMessage(roomid: number) {
        const messages = await this.prisma.message.findMany({
            where: {
                RoomId: roomid,
            },
            include: {
                user: {
                    select: {
                        avatar: true,
                        username: true,
                    },
                },
            }
        });
        return messages;
    }

    async RoomData(user: User, roomId) {
        const infos = await this.prisma.room.findFirst({
            where: {
                RoomId: roomId,
            },
            include: {
                members: {
                    select: {
                        UserId: true,

                        member: {
                            select: {
                                avatar: true,
                                username: true,
                                status: true,
                            }
                        }
                    }
                }
            },
        });

        var avatar;
        var name;
        var status;
        if (!infos.ischannel) {
            if (infos.members && infos.members.length == 2) {
                avatar = infos.members[0].UserId === user.UserId ? infos.members[1].member.avatar : infos.members[0].member.avatar;
                name = infos.members[0].UserId === user.UserId ? infos.members[1].member.username : infos.members[0].member.username;
                status = infos.members[0].UserId === user.UserId ? infos.members[1].member.status : infos.members[0].member.status;
            }
        }
        else {
            name = infos.RoomNAme;
        }
        return {
            type: infos.Type,
            isChannel: infos.ischannel,
            avatar,
            name,
            status,
        }
    }

    // async getRooms() {

    //     const messages = await this.prisma.room.findMany({
    //         where: {
    //             ischannel: true,
    //         },
    //         include: {
    //             Message: {
    //                 orderBy: {
    //                     SendTime: 'desc',
    //                 },
    //                 take: 1
    //             },
    //         },
    //     })
    //     // if (messages[userid].isBanned)
    //     //   return null;
    //     return messages;
    // }
    // async getroomsdms(userid: string) {
    //     const messages = await this.prisma.room.findMany({
    //         where: {
    //             members: {
    //                 some: {
    //                     UserId: userid,
    //                 },
    //             },
    //             ischannel: false,
    //         },
    //         include: {
    //             Message: {
    //                 select: {
    //                     RoomId: true,
    //                     Content: true,
    //                 },
    //                 orderBy: {
    //                     SendTime: 'desc',
    //                 },
    //                 take: 1
    //             },
    //             members: {
    //                 include: {
    //                     member: {
    //                         select: {
    //                             avatar: true,
    //                             username: true,
    //                             status: true,
    //                             UserId: true,
    //                         },
    //                     },
    //                 },
    //             },
    //         },

    //     })
    //     return messages;
    // }



    // async joinroom(userid: string, roomid: number, password: string) {
    //     const userexist = await this.prisma.membership.findFirst({
    //         where: {
    //             UserId: userid,
    //             RoomId: roomid,
    //         },
    //     });

    //     if (userexist) {
    //         return null;
    //     }
    //     const room = await this.prisma.room.findUnique({
    //         where: {
    //             RoomId: roomid,
    //         },
    //     });
    //     if (!room)
    //         return { message: 'room mnot found' };
    //     if (room[userid].isBanned)
    //         return {
    //             message: 'U re banned to join this room',
    //         };
    //     if (room.Type === 'protected') {
    //         const joinpprivateroom = await this.checkpassword(roomid, password);
    //         if (!joinpprivateroom)
    //             return null
    //     }

    //     const join = await this.prisma.membership.create({
    //         data: {
    //             UserId: userid,
    //             RoomId: roomid,
    //             Role: 'member',
    //             isBanned: false,
    //             isMuted: false,
    //         },
    //     });

    //     return join;
    // }
    // async checkpassword(roomid: number, password: string) {
    //     const room = await this.prisma.room.findUnique({
    //         where: {
    //             RoomId: roomid,
    //         },
    //     });
    //     if (room.Type !== 'protected') {
    //         return false
    //     }
    //     if (room.Password !== password)
    //         return false
    //     else {
    //         return room.Password === password;
    //     }
    // }

    async getRooms(userid: string) {

        const messages = await this.prisma.room.findMany({
            where: {
                ischannel: true,
                OR: [
                    {
                        members: {
                            some: {
                                UserId: userid,
                            },
                        },
                    },
                    {
                        Type: {
                            in: ['public', 'protected'],
                        },
                    },
                ],
            },
            include: {
                Message: {
                    orderBy: {
                        SendTime: 'desc',
                    },
                    take: 1,
                },
            },
        });
        // const rooms = messages;
        // for (const room of rooms) {
        //   if (room['members']?.some(member => member.UserId === userid && member.isBanned)) {
        //     return null;
        //   }
        // }
        return messages;
    }

    async getBlockeduserIds(user)
	{
		const blockedUser = await this.prisma.friendship.findMany({
			where : {
				OR : [
					{
						SenderId : user,
						OR : [
								{blockedBySender : true},
								{blockedByReceiver : true},
						]
					},
					{
						ReceiverId : user,
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

    async sendMessage(content: string, UserId: string, roomId: string) {
        const RoomId = parseInt(roomId);
        console.log(RoomId, UserId, content);
        const send = await this.prisma.message.create({
            data: {
                UserId: UserId,
                Content: content,
                RoomId: RoomId,
            },
            include : {
                user: {
                    select:
                    {
                        avatar: true,
                        username: true,
                    }
                },
                room : {
                    select : {
                        ischannel : true,
                    }
                }
            }
        })

        var blocked = [];
        if (send.room.ischannel)
            blocked = await this.getBlockeduserIds(send.UserId);
        return {
            send, blocked, ischannel : send.room.ischannel
        };
    }

    async getroomsdms(userid: string) {
        const messages = await this.prisma.room.findMany({
            where: {
                members: {
                    some: {
                        member: {
                            OR: [
                                {
                                    ReceiverFriendships: {
                                        some: {
                                            Accepted: true,
                                            blockedBySender: false,
                                            blockedByReceiver: false,
                                            sender: {
                                                UserId: userid,
                                            },
                                        },
                                    },
                                },
                                {
                                    SenderFriendships: {
                                        some: {
                                            Accepted: true,
                                            blockedBySender: false,
                                            blockedByReceiver: false,
                                            receiver: {
                                                UserId: userid,
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
                ischannel: false,
            },
            include: {
                Message: {
                    orderBy: {
                        SendTime: 'desc',
                    },
                    take: 1
                },
                members: {
                    include: {
                        member: {
                            select: {
                                avatar: true,
                                username: true,
                                status: true,
                                UserId: true,
                            },
                        },
                    },
                },
            },
        })
        return messages;
    }



    async joinroom(userid: string, roomid: number, password: string) {
        console.log(password)
        const userexist = await this.prisma.membership.findFirst({
            where: {
                UserId: userid,
                RoomId: roomid,
            },
        });
        if (userexist) {
            return {
                message: 'u are already a member of this room',
                is: false
            };
        }

        const room = await this.prisma.room.findUnique({
            where: {
                RoomId: roomid,
            },
        });
        if (!room)
            return {
                message: 'room mnot found',
                is: false
            };
        if (room.Type === 'protected') {
            const joinpprivateroom = await bcrypt.compare(password, room.Password);;
            if (!joinpprivateroom)
                return { message: 'Password is incorrect' };
        }

        const join = await this.prisma.membership.create({
            data: {
                UserId: userid,
                RoomId: roomid,
                Role: 'member',
                isBanned: false,
                isMuted: false,
            },
        });

        return join;

    }
    async checkpassword(roomid: number, password: string) {
        const room = await this.prisma.room.findUnique({
            where: {
                RoomId: roomid,
            },
        });
        if (room.Type !== 'protected') {
            return false
        }
        const passwordMatches = await bcrypt.compare(password, room.Password);
        return passwordMatches;
    }



    async checkmembership(roomId: number, userId: string) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                RoomId: roomId,
                UserId: userId,
            },
        });
        return !!membership;
    }

    async getroomdetails(roomId : number, User : User)
    {
      const roomDetails = await this.prisma.room.findUnique({
        where: {
          RoomId: roomId,
        },
        select : {
            RoomId : true,
            RoomNAme : true,
            ischannel : true,
            Type : true,
            members : {
               select : {
                    MembershipId : true,
                    Role : true,
                    isBanned : true,
                    isMuted : true,
                    member : {
                        select : {
                            avatar : true,
                            username : true,
                            UserId : true,
                            status : true,
                        }
                    }
               }
            }
        }
      });

      const final = {
        RoomId : roomDetails.RoomId,
        RoomName : roomDetails.RoomNAme,
        isChannel : roomDetails.ischannel,
        Type : roomDetails.Type,
        UserRole : roomDetails.members.map((user) => {
            if (user.member.UserId === User.UserId)
                return user.Role;
        }).filter((user) => user != null)[0],
        members : roomDetails.members, 
      }
      return final;
    }
    

}