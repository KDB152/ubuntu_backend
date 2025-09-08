import { MessagingService } from './messaging.service';
import { SimplifiedMessagingService } from './simplified-messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Response } from 'express';
export declare class MessagingController {
    private readonly messagingService;
    private readonly simplifiedMessagingService;
    constructor(messagingService: MessagingService, simplifiedMessagingService: SimplifiedMessagingService);
    getConversations(userId: string, userRole: string, req: any): Promise<any[]>;
    getConversation(id: string): Promise<import("./entities/conversation.entity").Conversation>;
    createConversation(dto: CreateConversationDto): Promise<void>;
    getMessages(conversationId: string, req: any): Promise<import("./entities/message.entity").Message[]>;
    sendMessage(dto: SendMessageDto, req: any): Promise<import("./entities/message.entity").Message>;
    updateMessage(id: string, updateData: {
        content: string;
    }, req: any): Promise<import("./entities/message.entity").Message>;
    deleteMessage(id: string, req: any): Promise<{
        success: boolean;
    }>;
    updateConversation(id: string, updateData: {
        title?: string;
    }, req: any): Promise<import("./entities/conversation.entity").Conversation>;
    deleteConversation(id: string, req: any): Promise<{
        success: boolean;
    }>;
    markMessageAsRead(messageId: string): Promise<import("typeorm").UpdateResult>;
    searchMessages(conversationId: string, query: string): Promise<import("./entities/message.entity").Message[]>;
    getAvailableRecipients(req: any): Promise<import("../users/users.module").User[]>;
    createOrGetConversation(req: any, body: {
        recipientId: number;
    }): Promise<{
        conversation: {
            participant1_id: number;
            participant2_id: number;
            id: number;
            groupe_id: number;
            last_message_id: number;
            type: string;
            title: string;
            class_level: string;
            created_at: Date;
            updated_at: Date;
            groupe: import("./entities/groupe.entity").Groupe;
            participant1: import("../users/users.module").User;
            participant2: import("../users/users.module").User;
        };
        isNew: boolean;
    }>;
    test(): Promise<{
        message: string;
    }>;
    uploadFile(file: Express.Multer.File, req: any): Promise<{
        fileName: string;
        storedName: string;
        filePath: any;
        fileType: string;
        fileSize: number;
    }>;
    downloadFile(messageId: string, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
}
