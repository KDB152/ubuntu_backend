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
exports.SousDossiersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sous_dossier_entity_1 = require("./entities/sous-dossier.entity");
let SousDossiersService = class SousDossiersService {
    constructor(sousDossiersRepository) {
        this.sousDossiersRepository = sousDossiersRepository;
    }
    async create(createSousDossierDto) {
        const sousDossier = this.sousDossiersRepository.create(createSousDossierDto);
        return this.sousDossiersRepository.save(sousDossier);
    }
    async findByDossier(dossierId) {
        if (isNaN(dossierId) || dossierId < 1) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        return this.sousDossiersRepository.find({
            where: { dossier_id: dossierId },
            relations: ['fichiers'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        if (isNaN(id) || id < 1) {
            throw new common_1.BadRequestException('ID de sous-dossier invalide');
        }
        const sousDossier = await this.sousDossiersRepository.findOne({
            where: { id },
            relations: ['fichiers', 'dossier'],
        });
        if (!sousDossier) {
            throw new common_1.NotFoundException('Sous-dossier non trouvé');
        }
        return sousDossier;
    }
    async update(id, updateData) {
        const sousDossier = await this.findOne(id);
        Object.assign(sousDossier, updateData);
        return this.sousDossiersRepository.save(sousDossier);
    }
    async remove(id) {
        const sousDossier = await this.findOne(id);
        await this.sousDossiersRepository.remove(sousDossier);
    }
};
exports.SousDossiersService = SousDossiersService;
exports.SousDossiersService = SousDossiersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sous_dossier_entity_1.SousDossier)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SousDossiersService);
//# sourceMappingURL=sous-dossiers.service.js.map