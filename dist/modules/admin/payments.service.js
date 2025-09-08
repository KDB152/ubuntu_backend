"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
let PaymentsService = class PaymentsService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async findAll(filters = {}) {
        const query = this.paymentRepository.createQueryBuilder('paiement')
            .leftJoin('students', 'student', 'paiement.student_id = student.id')
            .leftJoin('users', 'student_user', 'student.user_id = student_user.id')
            .leftJoin('parents', 'parent', 'paiement.parent_id = parent.id')
            .leftJoin('users', 'parent_user', 'parent.user_id = parent_user.id')
            .select([
            'paiement.*',
            'student_user.first_name as student_first_name',
            'student_user.last_name as student_last_name',
            'student.class_level as class_level',
            'parent_user.first_name as parent_first_name',
            'parent_user.last_name as parent_last_name'
        ]);
        if (filters.classLevel && filters.classLevel !== 'Total') {
            query.andWhere('student.class_level = :classLevel', { classLevel: filters.classLevel });
        }
        if (filters.status && filters.status !== 'Tous') {
            query.andWhere('paiement.statut = :status', { status: filters.status });
        }
        return await query.getRawMany();
    }
    async findOne(id) {
        return await this.paymentRepository.findOne({
            where: { id },
            relations: ['student', 'parent']
        });
    }
    async update(id, updateData) {
        if (updateData.seances_payees !== undefined || updateData.seances_non_payees !== undefined) {
            const payment = await this.paymentRepository.findOne({ where: { id } });
            if (payment) {
                const prixSeance = payment.prix_seance || 40;
                const seancesTotal = updateData.seances_payees + updateData.seances_non_payees;
                const montantTotal = seancesTotal * prixSeance;
                const montantPaye = updateData.seances_payees * prixSeance;
                const montantRestant = montantTotal - montantPaye;
                updateData = {
                    ...updateData,
                    seances_total: seancesTotal,
                    montant_total: montantTotal,
                    montant_paye: montantPaye,
                    montant_restant: montantRestant,
                    statut: montantRestant === 0 ? 'paye' : (montantPaye > 0 ? 'partiel' : 'en_attente')
                };
            }
        }
        await this.paymentRepository.update(id, updateData);
        return await this.findOne(id);
    }
    async create(paymentData) {
        const payment = this.paymentRepository.create(paymentData);
        return await this.paymentRepository.save(payment);
    }
    async remove(id) {
        return await this.paymentRepository.delete(id);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map