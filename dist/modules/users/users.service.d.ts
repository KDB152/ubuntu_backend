import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { StudentsService } from '../students/students.service';
export declare class UsersService {
    private readonly usersRepository;
    private readonly studentsService;
    constructor(usersRepository: Repository<User>, studentsService: StudentsService);
    createUser(data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        role?: UserRole;
        is_approved?: boolean;
        is_active?: boolean;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByRole(role: string): Promise<User[]>;
    update(id: number, data: Partial<User>): Promise<User>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
