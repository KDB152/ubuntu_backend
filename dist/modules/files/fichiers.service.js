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
exports.FichiersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fichier_entity_1 = require("./entities/fichier.entity");
let FichiersService = class FichiersService {
    constructor(fichiersRepository) {
        this.fichiersRepository = fichiersRepository;
    }
    async create(createFichierDto) {
        const fichier = this.fichiersRepository.create(createFichierDto);
        return this.fichiersRepository.save(fichier);
    }
    async findBySousDossier(sousDossierId) {
        if (isNaN(sousDossierId) || sousDossierId < 1) {
            throw new common_1.BadRequestException('ID de sous-dossier invalide');
        }
        return this.fichiersRepository.find({
            where: { sous_dossier_id: sousDossierId },
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        if (isNaN(id) || id < 1) {
            throw new common_1.BadRequestException('ID de fichier invalide');
        }
        const fichier = await this.fichiersRepository.findOne({
            where: { id },
            relations: ['sous_dossier'],
        });
        if (!fichier) {
            throw new common_1.NotFoundException('Fichier non trouvé');
        }
        return fichier;
    }
    async update(id, updateData) {
        const fichier = await this.findOne(id);
        Object.assign(fichier, updateData);
        return this.fichiersRepository.save(fichier);
    }
    async remove(id) {
        const fichier = await this.findOne(id);
        await this.fichiersRepository.remove(fichier);
    }
    async incrementDownloadCount(id) {
        await this.fichiersRepository.increment({ id }, 'download_count', 1);
    }
};
exports.FichiersService = FichiersService;
exports.FichiersService = FichiersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fichier_entity_1.Fichier)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FichiersService);
//# sourceMappingURL=fichiers.service.js.map