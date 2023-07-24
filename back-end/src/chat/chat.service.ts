<<<<<<< HEAD
import { Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { ConversationDto, RoomDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
    prisma = new PrismaClient();

    constructor(){}


    async checkOnRooms(User : User, UserId)
    {
        const user1Memberships = await this.prisma.membership.findMany({
            where: {
              UserId: User.UserId,
            },
            select: {
              RoomId: true,
            },
        });

        const sharedRoom = await this.prisma.membership.findFirst({
            where: {
              UserId: UserId,
              RoomId: {
                in: user1Memberships.map((membership) => membership.RoomId),
              },
              room: {
                ischannel: true,
              },
            },
            select : {
                RoomId : true,
            }
        });

        return sharedRoom;
    }

    async createRoom(room : RoomDto, authUser : User)
    {
        const isChannel = room.users.length > 1 ? false : true;

        if (isChannel)
        {

            const exist = await this.checkOnRooms(authUser, room.users[0]);
            
            if (exist)
                return exist;
        }

        const Name = room.name || uuidv4();

        const Room = await this.prisma.room.create({
            data : {RoomNAme : room.name, Password : room.password, ischannel : isChannel}
        })

        const members = room.users.map((user) => {
            return {
                UserId : user,
                RoomId : Room.RoomId,
                isBanned : false,
                isMuted : false,
                Role : "USER",
            }
        });

        const Role = isChannel ? "USER" : "ADMIN";
        
        members.push({
            UserId : authUser.UserId,
            RoomId : Room.RoomId,
            isBanned : false,
            isMuted : false,
            Role : Role,
        })


        const membership = await this.prisma.membership.createMany({
            data : members, 
        })

        return Room;
    }

    async getConversation(RoomId, UserId)
    {
        const Conversation = await this.prisma.message.findMany({
            where : {
                RoomId : RoomId,
            },
            select : {
                Content : true,
                MessageId : true,
                UserId : true,
                user : {
                    select : {
                        username : true,
                        avatar : true,
                    }
                },
                room : {
                    select : {
                        ischannel : true,
                        members : {
                            where : {
                                UserId : UserId,
                            },
                            select : {
                                Role : true,
                            }
                        }
                    }
                },
            },
            orderBy : {
                SendTime : 'desc',
            }

        });

        const final : ConversationDto[] = Conversation.map((message)=>{
            const isAdmin = message.room.members[0].Role === "ADMIN" ? true : false;
            const isOwner = message.UserId === UserId ? true : false;
            return {
                avatar : message.user.avatar,
                username : message.user.username,
                content : message.Content,
                isChannel : message.room.ischannel,
                MessageId : message.MessageId,
                isAdmin : isAdmin,
                isOwner : isOwner,
            }
        })
        return final;
    }

    async sendMessage(content : string, UserId : string, roomId : string)
    {
        const RoomId = parseInt(roomId);
        console.log(RoomId, UserId, content);
        const send = await this.prisma.message.create({
            data : {
                UserId : UserId,
                Content : content,
                RoomId : RoomId,
            },
            select : {
                MessageId : true,
                UserId : true,
                user : {
                    select :
                    {
                        avatar : true,
                        username : true,
                    }
                }
            }
        })
    }

    async getRooms(User : User)
    {
        const rooms = await this.prisma.membership.findMany({
            where : {
                UserId : User.UserId,
            },
            select :{
                RoomId : true,
            }
        });

        const chatPromises = rooms.map(room => {
            return this.prisma.message.findFirst({
              where: {
                RoomId: room.RoomId,
              },
              include : {
                user : {
                    select : {
                        UserId : true,
                        username : true,
                        avatar : true,
                        status : true,
                    }
                }
              },
              orderBy: {
                SendTime: 'desc', // Replace 'sentAt' with the field name you use for when the message was sent
              },
            }).then(message => ({
              RoomId: room.RoomId,
              content: message ? message.Content : undefined,
              UserId : message ? message.UserId : undefined,
              avatar : message ? message.user.avatar : undefined,
              username : message ? message.user.username : undefined,
              status : message ? message.user.status : undefined,
              MessageId : message? message.MessageId : undefined,
            }));
        });
          
        const chat = await Promise.all(chatPromises);
        return chat;
    }

    async DeleteRoom(User : User, RoomId : number)
    {
        const deleted = await this.prisma.$transaction(async (prisma) => {
            await this.prisma.message.deleteMany({
                where : {
                    RoomId,
                }
            }),
            await this.prisma.membership.deleteMany({
                where : {
                    RoomId,
                }
            }),
            await this.prisma.room.delete({
                where : {
                    RoomId,
                }
            })
        })
    }

    async addUser(User : User, RoomId : number, Users : string[])
    {
        const added = await this.prisma.membership.createMany({
            data: Users.map((user) => ({
                UserId: user,
                RoomId: RoomId,
                Role : "USER",
                isBanned : false,
                isMuted : false,
            })),
        })
    }
}
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {}
>>>>>>> 46d7dd454019aefa009a489adde17392b1e36081
