import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
export declare class PaymentsService {
    private paymentRepository;
    constructor(paymentRepository: Repository<Payment>);
    findAll(filters?: {
        classLevel?: string;
        status?: string;
    }): Promise<any[]>;
    findOne(id: number): Promise<Payment>;
    update(id: number, updateData: Partial<Payment>): Promise<Payment>;
    create(paymentData: Partial<Payment>): Promise<Payment>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
