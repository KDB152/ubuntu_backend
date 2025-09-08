import { Groupe } from './groupe.entity';
import { User } from '../../users/entities/user.entity';
export declare class Conversation {
    id: number;
    groupe_id: number;
    last_message_id: number;
    type: string;
    title: string;
    participant1_id: number;
    participant2_id: number;
    class_level: string;
    created_at: Date;
    updated_at: Date;
    groupe: Groupe;
    participant1: User;
    participant2: User;
}
