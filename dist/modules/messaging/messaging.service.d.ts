import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Groupe } from './entities/groupe.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Parent } from '../parents/entities/parent.entity';
import { ParentStudent } from '../relations/entities/parent-student.entity';
import { GroupService } from './group.service';
export declare class MessagingService {
    private conversationRepository;
    private messageRepository;
    private groupeRepository;
    private userRepository;
    private studentRepository;
    private parentRepository;
    private parentStudentRepository;
    private groupService;
    constructor(conversationRepository: Repository<Conversation>, messageRepository: Repository<Message>, groupeRepository: Repository<Groupe>, userRepository: Repository<User>, studentRepository: Repository<Student>, parentRepository: Repository<Parent>, parentStudentRepository: Repository<ParentStudent>, groupService: GroupService);
    getConversations(userId: number): Promise<any[]>;
    getConversation(id: number): Promise<Conversation>;
    createConversation(dto: CreateConversationDto): Promise<void>;
    getMessages(conversationId: number): Promise<Message[]>;
    getMessage(messageId: number): Promise<Message>;
    sendMessage(dto: SendMessageDto): Promise<Message>;
    markMessageAsRead(messageId: number): Promise<import("typeorm").UpdateResult>;
    searchMessages(conversationId: number, query: string): Promise<Message[]>;
    uploadFile(file: Express.Multer.File, userId: number): Promise<{
        fileName: string;
        storedName: string;
        filePath: any;
        fileType: string;
        fileSize: number;
    }>;
    getAvailableRecipients(currentUserId: number, currentUserRole: string): Promise<User[]>;
    updateMessage(messageId: number, newContent: string, currentUserId: number, currentUserRole: string): Promise<Message>;
    deleteMessage(messageId: number, currentUserId: number, currentUserRole: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateConversation(conversationId: number, updateData: {
        title?: string;
    }, adminId: number): Promise<Conversation>;
    deleteConversation(conversationId: number, adminId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrGetConversation(currentUserId: number, currentUserRole: string, recipientId: number): Promise<{
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
            groupe: Groupe;
            participant1: User;
            participant2: User;
        };
        isNew: boolean;
    }>;
}
