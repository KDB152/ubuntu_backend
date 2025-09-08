import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';
import { ParentsService } from '../parents/parents.service';
import { RelationsService } from '../relations/relations.service';
import { User, UserRole } from '../users/entities/user.entity';
import { EmailVerificationService } from './email-verification.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private studentsService;
    private parentsService;
    private relationsService;
    private emailVerificationService;
    private userRepository;
    private jwtService;
    findUserByEmail(email: string): void;
    emailService: any;
    constructor(usersService: UsersService, studentsService: StudentsService, parentsService: ParentsService, relationsService: RelationsService, emailVerificationService: EmailVerificationService, userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: number;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            role: UserRole;
            firstName: string;
            lastName: string;
        };
    }>;
    verifyEmailToken(token: string): Promise<boolean>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    private generateTemporaryPassword;
}
