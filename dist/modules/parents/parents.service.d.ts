import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
export declare class ParentsService {
    private parentsRepository;
    findByUserId(userId: number): Promise<Parent | null>;
    findByUserIdWithUser(userId: number): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        occupation: string;
        role: string;
        isActive: boolean;
        isApproved: boolean;
        createdAt: string;
    }>;
    constructor(parentsRepository: Repository<Parent>);
    createParent(userId: number, phone?: string): Promise<Parent>;
    findAll({ page, limit }: {
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
    findOne(id: number): Promise<Parent>;
    create(dto: CreateParentDto): Promise<Parent>;
    update(id: number, dto: UpdateParentDto): Promise<Parent>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
    getChild(parentId: number): Promise<any>;
}
