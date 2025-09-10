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
exports.RendezVousService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rendez_vous_entity_1 = require("./entities/rendez-vous.entity");
let RendezVousService = class RendezVousService {
    constructor(rendezVousRepository) {
        this.rendezVousRepository = rendezVousRepository;
    }
    async getRendezVousByParentId(parentId, status) {
        const where = { parent_id: parentId };
        if (status) {
            where.status = status;
        }
        return this.rendezVousRepository.find({
            where,
            order: { timing: 'DESC' }
        });
    }
    async getAllRendezVous(status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        return this.rendezVousRepository.find({
            where,
            order: { timing: 'DESC' }
        });
    }
    async getRendezVousById(id) {
        return this.rendezVousRepository.findOne({
            where: { id }
        });
    }
    async updateRendezVous(id, updateData) {
        const rendezVous = await this.rendezVousRepository.findOne({
            where: { id }
        });
        if (!rendezVous) {
            throw new Error('Rendez-vous non trouvé');
        }
        rendezVous.status = updateData.status;
        if (updateData.adminReason !== undefined) {
            rendezVous.admin_reason = updateData.adminReason;
        }
        if (updateData.updatedAt) {
            rendezVous.updated_at = new Date(updateData.updatedAt);
        }
        return this.rendezVousRepository.save(rendezVous);
    }
    async deleteRendezVous(id) {
        const rendezVous = await this.rendezVousRepository.findOne({
            where: { id }
        });
        if (!rendezVous) {
            throw new Error('Rendez-vous non trouvé');
        }
        await this.rendezVousRepository.delete(id);
        return { message: 'Rendez-vous supprimé avec succès' };
    }
};
exports.RendezVousService = RendezVousService;
exports.RendezVousService = RendezVousService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rendez_vous_entity_1.RendezVous)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RendezVousService);
//# sourceMappingURL=rendez-vous.service.js.map