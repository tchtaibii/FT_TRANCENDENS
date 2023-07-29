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

    // messages: Message[] = [{ name: 'Saber', text: 'Heey' }];
    // clientToUser = {};
    // identify(name: string, clientId: string ){
    //   this.clientToUser[clientId] = name;

    //   return Object.values(this.clientToUser);
    // }

    // getClientName(clientId: string){
    //   return this.clientToUser[clientId];
    // }
    // create(createMessageDto: CreateMessageDto, clientId: string) {
    //   const message = { 
    //     name: this.clientToUser[clientId],
    //     text: createMessageDto.text,
    //   };
    //   this.messages.push(message);

    //   return message;
    // }

    // async findAll() {
    //   return this.messages;
    // }

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

    async addMemberToRoom(roomId: number, userId: string, userIDmin: string) {
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
        const checkmember = await this.prisma.membership.findFirst({
            where: {
                AND: [
                    { RoomId: roomId },
                    { UserId: userId },
                ],
            },
        });

        if (checkmember) {
            throw new NotFoundException('User deja kayen f room!');
        }

        const addmembership = await this.prisma.membership.create({
            data: {
                RoomId: roomId,
                UserId: userId,
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
            where : {
                RoomId : roomId,
            },
            include : {
                members : {
                    select : {
                        UserId : true,
                        member : {
                            select : {
                                avatar : true,
                                username : true,
                                status : true,
                            }
                        }
                    }
                }
            },
        });

        var avatar;
        var name;
        var status;
        if (infos.members && infos.members.length == 2)
        {
            avatar =  infos.members[0].UserId === user.UserId ? infos.members[1].member.avatar : infos.members[0].member.avatar;
            name = infos.members[0].UserId === user.UserId ? infos.members[1].member.username : infos.members[0].member.username;
            status = infos.members[0].UserId === user.UserId ? infos.members[1].member.status : infos.members[0].member.status;
        }
        else 
        {
            name = infos.RoomNAme;
        }

        return {
            isChannel : infos.ischannel,
            avatar,
            name,
            status,
        }
    }

    async getRooms(userid: string) {

        const messages = await this.prisma.room.findMany({
            where: {
                members: {
                    some: {
                        UserId: userid,
                    },
                },
                ischannel: true,
            },
            include: {
                Message: {
                    orderBy: {
                        SendTime: 'desc',
                    },
                    take: 1
                },
            },
        })
        // if (messages[userid].isBanned)
        //   return null;
        return messages;
    }
    async getroomsdms(userid: string) {
        const messages = await this.prisma.room.findMany({
            where: {
                members: {
                    some: {
                        UserId: userid,
                    },
                },
                ischannel: false,
            },
            include: {
                Message: {
                    select: {
                        RoomId: true,
                        Content: true,
                    },
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
        const userexist = await this.prisma.membership.findFirst({
            where: {
                UserId: userid,
                RoomId: roomid,
            },
        });

        if (userexist) {
            return null;
        }
        const room = await this.prisma.room.findUnique({
            where: {
                RoomId: roomid,
            },
        });
        if (!room)
            return { message: 'room mnot found' };
        if (room[userid].isBanned)
            return {
                message: 'U re banned to join this room',
            };
        if (room.Type === 'protected') {
            const joinpprivateroom = await this.checkpassword(roomid, password);
            if (!joinpprivateroom)
                return null
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
        if (room.Password !== password)
            return false
        else {
            return room.Password === password;
        }
    }
}