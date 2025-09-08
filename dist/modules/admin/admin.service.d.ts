import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';
import { ParentsService } from '../parents/parents.service';
import { PaymentsService } from './payments.service';
export declare class AdminService {
    private readonly usersService;
    private readonly studentsService;
    private readonly parentsService;
    private readonly paymentsService;
    constructor(usersService: UsersService, studentsService: StudentsService, parentsService: ParentsService, paymentsService: PaymentsService);
    listStudents({ page, limit }: {
        page?: number;
        limit?: number;
    }): Promise<{
        items: {
            id: number;
            studentId: number;
            firstName: string;
            lastName: string;
            email: string;
            phone_number: string;
            classLevel: string;
            birthDate: string;
            progressPercentage: number;
            averageScore: number;
            role: string;
            isActive: boolean;
            isApproved: boolean;
            createdAt: string;
            notes: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    listParents({ page, limit }: {
        page?: number;
        limit?: number;
    }): Promise<{
        items: {
            id: number;
            parentId: number;
            firstName: string;
            lastName: string;
            email: string;
            phone_number: string;
            address: string;
            occupation: string;
            role: string;
            isActive: boolean;
            isApproved: boolean;
            createdAt: string;
            notes: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    createMissingProfiles(): Promise<void>;
    createStudentWithUser(payload: any): Promise<{
        user: import("../users/entities/user.entity").User;
        student: import("../students/entities/student.entity").Student;
    }>;
    updateStudentWithUser(studentId: number, payload: any): Promise<import("../students/entities/student.entity").Student>;
    deleteStudent(studentId: number): Promise<{
        success: boolean;
    }>;
    createParentWithUser(payload: any): Promise<{
        user: import("../users/entities/user.entity").User;
        parent: import("../parents/entities/parent.entity").Parent;
    }>;
    updateParentWithUser(parentId: number, payload: any): Promise<import("../parents/entities/parent.entity").Parent>;
    deleteParent(parentId: number): Promise<{
        success: boolean;
    }>;
    setUserApproval(userId: number, approve: boolean): Promise<import("../users/entities/user.entity").User>;
    cleanTestUsers(): Promise<{
        deletedCount: number;
    }>;
    getPayments({ classLevel, status }: {
        classLevel?: string;
        status?: string;
    }): Promise<{
        payments: any[];
        total: number;
    }>;
    updatePayment(paymentId: number, updateData: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/payment.entity").Payment;
    }>;
}
