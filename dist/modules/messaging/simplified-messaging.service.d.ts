import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Parent } from '../parents/entities/parent.entity';
import { ParentStudent } from '../relations/entities/parent-student.entity';
export declare class SimplifiedMessagingService {
    private conversationRepository;
    private messageRepository;
    private userRepository;
    private studentRepository;
    private parentRepository;
    private parentStudentRepository;
    constructor(conversationRepository: Repository<Conversation>, messageRepository: Repository<Message>, userRepository: Repository<User>, studentRepository: Repository<Student>, parentRepository: Repository<Parent>, parentStudentRepository: Repository<ParentStudent>);
    getConversationsForUser(userId: number): Promise<any[]>;
    private createDirectConversation;
    private createClassConversation;
    getMessagesForConversation(conversationId: number, userId: number): Promise<Message[]>;
    checkConversationAccess(conversation: Conversation, userId: number): Promise<boolean>;
    sendMessage(conversationId: number, senderId: number, content: string, messageType?: string, filePath?: string, fileName?: string, fileType?: string): Promise<Message>;
    updateMessage(messageId: number, newContent: string, currentUserId: number, currentUserRole: string): Promise<Message>;
    deleteMessage(messageId: number, currentUserId: number, currentUserRole: string): Promise<{
        success: boolean;
    }>;
    updateConversation(conversationId: number, updateData: {
        title?: string;
    }, adminId: number): Promise<Conversation>;
    deleteConversation(conversationId: number, adminId: number): Promise<{
        success: boolean;
    }>;
    getMessage(messageId: number): Promise<Message>;
    getConversation(conversationId: number): Promise<Conversation>;
    uploadFile(file: Express.Multer.File, userId: number): Promise<{
        fileName: string;
        storedName: string;
        filePath: any;
        fileType: string;
        fileSize: number;
    }>;
}
