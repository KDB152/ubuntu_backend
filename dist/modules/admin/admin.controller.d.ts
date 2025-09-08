import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listStudents(page?: string, limit?: string): Promise<{
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
    createStudent(body: any): Promise<{
        user: import("../users/users.module").User;
        student: import("../students/entities/student.entity").Student;
    }>;
    updateStudent(id: string, body: any): Promise<import("../students/entities/student.entity").Student>;
    deleteStudent(id: string): Promise<{
        success: boolean;
    }>;
    listParents(page?: string, limit?: string): Promise<{
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
    createParent(body: any): Promise<{
        user: import("../users/users.module").User;
        parent: import("../parents/entities/parent.entity").Parent;
    }>;
    updateParent(id: string, body: any): Promise<import("../parents/entities/parent.entity").Parent>;
    deleteParent(id: string): Promise<{
        success: boolean;
    }>;
    approveUser(id: string, body: {
        approve: boolean;
    }): Promise<import("../users/users.module").User>;
    cleanTestUsers(): Promise<{
        deletedCount: number;
    }>;
    getPayments(classLevel?: string, status?: string): Promise<{
        payments: any[];
        total: number;
    }>;
    updatePayment(id: string, body: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/payment.entity").Payment;
    }>;
}
