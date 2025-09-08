import { Group } from './group.entity';
import { User } from '../../users/entities/user.entity';
export declare class GroupParticipant {
    id: number;
    group_id: number;
    user_id: number;
    role: string;
    is_active: boolean;
    created_at: Date;
    group: Group;
    user: User;
}
