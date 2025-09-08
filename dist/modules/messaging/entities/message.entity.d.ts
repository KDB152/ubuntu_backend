import { User } from '../../users/entities/user.entity';
import { Groupe } from './groupe.entity';
import { Conversation } from './conversation.entity';
export declare class Message {
    id: number;
    sender_id: number;
    recipient_id: number;
    groupe_id: number;
    conversation_id: number;
    content: string;
    message_type: string;
    is_read: boolean;
    file_path: string;
    created_at: Date;
    updated_at: Date;
    sender: User;
    recipient: User;
    groupe: Groupe;
    conversation: Conversation;
}
