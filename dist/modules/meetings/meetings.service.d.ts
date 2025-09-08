import { Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';
import { Parent } from '../parents/entities/parent.entity';
export declare class MeetingsService {
    private meetingsRepository;
    private parentsRepository;
    constructor(meetingsRepository: Repository<Meeting>, parentsRepository: Repository<Parent>);
    getMeetingsByParentId(parentId: number, status?: string): Promise<Meeting[]>;
    getMeetingsByAdminId(adminId: number, status?: string): Promise<Meeting[]>;
    getAllMeetings(status?: string): Promise<Meeting[]>;
    getParentByUserId(userId: number): Promise<Parent>;
}
