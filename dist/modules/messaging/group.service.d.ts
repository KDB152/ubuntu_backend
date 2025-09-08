import { Repository } from 'typeorm';
import { Groupe } from './entities/groupe.entity';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Parent } from '../parents/entities/parent.entity';
import { ParentStudent } from '../relations/entities/parent-student.entity';
export declare class GroupService {
    private groupeRepository;
    private userRepository;
    private studentRepository;
    private parentRepository;
    private parentStudentRepository;
    constructor(groupeRepository: Repository<Groupe>, userRepository: Repository<User>, studentRepository: Repository<Student>, parentRepository: Repository<Parent>, parentStudentRepository: Repository<ParentStudent>);
    createOrGetClassGroup(classLevel: string): Promise<Groupe>;
    getUserGroups(userId: number, userRole: string): Promise<Groupe[]>;
    getGroupParticipants(groupeId: number): Promise<any[]>;
    canSendMessage(senderId: number, recipientId: number, senderRole: string): Promise<boolean>;
    getAvailableRecipients(currentUserId: number, userRole: string): Promise<User[]>;
}
