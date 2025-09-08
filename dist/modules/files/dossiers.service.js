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
exports.DossiersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dossier_entity_1 = require("./entities/dossier.entity");
let DossiersService = class DossiersService {
    constructor(dossiersRepository) {
        this.dossiersRepository = dossiersRepository;
    }
    async create(createDossierDto) {
        const dossier = this.dossiersRepository.create(createDossierDto);
        return this.dossiersRepository.save(dossier);
    }
    async findAll() {
        return this.dossiersRepository.find({
            relations: ['sous_dossiers'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        if (isNaN(id) || id < 1) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        const dossier = await this.dossiersRepository.findOne({
            where: { id },
            relations: ['sous_dossiers', 'sous_dossiers.fichiers'],
        });
        if (!dossier) {
            throw new common_1.NotFoundException('Dossier non trouvé');
        }
        return dossier;
    }
    async update(id, updateData) {
        const dossier = await this.findOne(id);
        Object.assign(dossier, updateData);
        return this.dossiersRepository.save(dossier);
    }
    async remove(id) {
        const dossier = await this.findOne(id);
        await this.dossiersRepository.remove(dossier);
    }
};
exports.DossiersService = DossiersService;
exports.DossiersService = DossiersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dossier_entity_1.Dossier)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DossiersService);
//# sourceMappingURL=dossiers.service.js.map