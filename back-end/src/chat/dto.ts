import { ApiProperty } from "@nestjs/swagger";

export class RoomDto
{
    @ApiProperty({ description: 'The name of the room.' })
    readonly name?: string;

    @ApiProperty({ description: 'Array of user IDs', isArray: true, type: String })
    readonly users: string[];

    @ApiProperty({ description: 'password of the room', isArray: true, type: String })
    readonly password?: string;
}

export class ConversationDto
{
    avatar    : string;
    username  : string;
    content   : string;
    isChannel : boolean;
    isAdmin   : boolean;
    MessageId : number;
    isOwner   : boolean;
}

export class AddUsers
{
    @ApiProperty({ description: 'Array of user IDs', isArray: true, type: String })
    readonly users: string[];
}