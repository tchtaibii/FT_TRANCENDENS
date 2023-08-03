import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto, MessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { PrismaClient, User } from '@prisma/client';
import { CreateMembershipDto, CreateRoomDto } from './dto/room.dto';
import { StringDecoder } from 'string_decoder';
import * as bcrypt from 'bcrypt'
import { ChatGateway } from './messages.gateway';

@Injectable()
export class MessagesService {

    constructor(private readonly prisma: PrismaClient, private readonly ChatGateaway : ChatGateway) { }

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


        const deleted = await this.prisma.$transaction(async (prisma) => {
            await prisma.message.deleteMany({
                where : {
                    RoomId : roomId,
                }
            }),
            await prisma.membership.deleteMany({
                where : {
                    RoomId : roomId,
                }
            }),
            await prisma.room.delete({
                where : {
                    RoomId : roomId,
                }
            })
        })

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

        const deleted = await this.prisma.membership.deleteMany({
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

    async muteMember(userId: string, membershipId: number, roomid: number, time : number) {
        const membership = await this.prisma.membership.findFirst({
            where: { 
                UserId: userId, 
                RoomId : roomid,    
            },
        });

        if (!membership) {
            throw new UnauthorizedException('Membership does not exist.');
        }

        if (membership.Role !== 'Owner' && membership.Role !== 'Admin') {
            throw new UnauthorizedException("You don't have the right to mute.");
        }
    
        const newdate = new Date();

        newdate.setHours(newdate.getHours() + time);
    
        await this.prisma.membership.update({
            where: {
                RoomId: roomid,
                MembershipId: membershipId,
            },
            data: {
                isMuted: true,
                unmuteUntil : newdate,
            },
        });
        
    }

    async BannedMember(userId: string, membershipId: number, roomid: number) {


        const membership = await this.prisma.membership.findFirst({
            where: {
                    UserId: userId,
                    RoomId : roomid,
            },
        });


        if (!membership) {
            throw new UnauthorizedException('Membership does not exist.');
        }

        if (membership.Role !== 'Owner' && membership.Role !== 'Admin') {
            throw new UnauthorizedException("You don't have the right to ban.");
        }

        console.log('here');

        await this.prisma.membership.update({
            where: {
                RoomId: roomid,
                MembershipId: membershipId,
            },
            data: {
                isBanned: true,
            },
        });
    }

    async unmuteMember(userId: string, membershipId: number, roomid: number) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                    UserId: userId,
                    RoomId : roomid,
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
                        UserId: userId,
                        RoomId : roomid,
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

        messages.map((msg) => {
            msg.user.avatar = msg.user.avatar.search("https://cdn.intra.42.fr/users/") === -1 && !msg.user.avatar.search('/uploads/') ? process.env.HOST + process.env.PORT + msg.user.avatar : msg.user.avatar;
        })
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
            avatar : avatar && avatar.search("https://cdn.intra.42.fr/users/") === -1 && !avatar.search('/uploads/') ? process.env.HOST + process.env.PORT + avatar : avatar,
            name,
            status,
        }
    }

    async getRooms(userid: string) {

        const rooms = await this.prisma.room.findMany({
            where: {
              ischannel: true,
              members : {
                none : {
                    UserId : userid,
                    isBanned : true,
                }
                },
                OR: [
                {
                    Type: 'public',
                },
                {
                    Type: 'protected'
                },
                {
                    AND: [
                    {
                        Type: 'private'
                    },
                    {
                        members: {
                        some : {
                            UserId: userid
                        }
                        }
                    }
                    ]
                }
                ]
            },
            include: {
              Message: {
                orderBy: {
                  SendTime: 'desc'
                },
                take: 1
              },
              members : {
                select : {
                    isBanned : true,
                    UserId : true,
                }
              }
            }
        });
    
        return rooms;
    }

   

    async getroomsdms(userid: string) {
        const messages = await this.prisma.room.findMany({
            where: {
                members: {
                    some: {
                        member: {
                            UserId : userid,
                        },
                    },
                },
                OR: [
                    {
                        members: {
                            some: {
                                member: {
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
                            },
                        },
                    },
                    {
                        members: {
                            some: {
                                member: {
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
                            },
                        },
                    },
                ],
                ischannel: false,
            },
            include: {
                Message: {
                    orderBy: {
                        SendTime: 'desc',
                    },
                    take: 1,
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
        const msg = messages.map((room) => {
            
            let check = {name: room.members[0].member.UserId === userid ? room.members[1].member.username : room.members[0].member.username,
                avatar: room.members[0].member.UserId === userid ? room.members[1].member.avatar : room.members[0].member.avatar,
                status: room.members[0].member.UserId === userid ? room.members[1].member.status : room.members[0].member.status,
                userid: room.members[0].member.UserId === userid ? room.members[1].member.UserId : room.members[0].member.UserId,
                roomid: room.RoomId,
                lastMessage: room.Message.length > 0 ? {
                content: room.Message[0].Content,
                } : null,
            }
            check.avatar = check.avatar.search("https://cdn.intra.42.fr/users/") === -1 && !check.avatar.search('/uploads/') ? process.env.HOST + process.env.PORT + check.avatar : check.avatar;
            return check;
          }
        )
        ;
        return messages;
    }



    async joinroom(userid: string, roomid: number, password: string) {

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
                Role: 'Member',
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

      roomDetails.members.map((member) => {
        member.member.avatar = member.member.avatar.search("https://cdn.intra.42.fr/users/") === -1
            && !member.member.avatar.search('/uploads/') ? process.env.HOST + process.env.PORT + member.member.avatar
                : member.member.avatar;
      })

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
    
    async unmuteUsers()
    {
        const users = await this.prisma.membership.findMany({
            where : {
                isMuted : true,
            },
            select : {
                unmuteUntil : true,
                MembershipId : true,
            },
        });

        if (users)
            users.map(async (user) => {
                if (user.unmuteUntil < new Date())
                {
                    await this.prisma.membership.update({
                        where : {
                            MembershipId : user.MembershipId
                        },
                        data : {
                            isMuted : false,
                        }
                    })
                }
            });
    }

    async setAdmin(membershipId : number, User : User, roomId : number)
    {
        const membership = await this.prisma.membership.findFirst({
            where : {
                UserId : User.UserId,
                RoomId : roomId,
            }
        })
    
        if (!membership) {
            throw new UnauthorizedException('Membership does not exist.');
        }

        if (membership.Role !== 'Owner') {
            throw new UnauthorizedException("You don't have the right to mute.");
        }

        const done = await this.prisma.membership.update({
            where : {
                MembershipId : membershipId,
            },
            data : {
                Role : "Admin",
            }
        })

        return done ? true : false;
    }
}