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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_entity_1 = require("./entities/file.entity");
let FilesService = class FilesService {
    constructor(filesRepository) {
        this.filesRepository = filesRepository;
    }
    async create(createFileDto, uploadedBy) {
        const file = this.filesRepository.create({
            ...createFileDto,
            uploadedBy,
        });
        return this.filesRepository.save(file);
    }
    async findAll() {
        return this.filesRepository.find({
            where: { isActive: true },
            relations: ['uploader'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const file = await this.filesRepository.findOne({
            where: { id, isActive: true },
            relations: ['uploader'],
        });
        if (!file) {
            throw new common_1.NotFoundException(`Fichier avec l'ID ${id} non trouvé`);
        }
        return file;
    }
    async update(id, updateFileDto) {
        const file = await this.findOne(id);
        Object.assign(file, updateFileDto);
        console.log(`📝 Mise à jour du fichier ID ${id}:`, {
            title: file.title
        });
        return this.filesRepository.save(file);
    }
    async remove(id) {
        const file = await this.findOne(id);
        try {
            if (file.filePath && require('fs').existsSync(file.filePath)) {
                require('fs').unlinkSync(file.filePath);
                console.log(`🗑️ Fichier physique supprimé: ${file.filePath}`);
            }
        }
        catch (error) {
            console.warn(`⚠️ Impossible de supprimer le fichier physique: ${error.message}`);
        }
        await this.filesRepository.remove(file);
        console.log(`🗑️ Fichier supprimé de la base de données: ID ${id}`);
    }
    async incrementDownloadCount(id) {
        await this.filesRepository.increment({ id }, 'downloadCount', 1);
    }
    async getFileStats() {
        const totalFiles = await this.filesRepository.count({
            where: { isActive: true }
        });
        const totalDownloads = await this.filesRepository
            .createQueryBuilder('file')
            .select('SUM(file.downloadCount)', 'total')
            .where('file.isActive = :isActive', { isActive: true })
            .getRawOne();
        return {
            totalFiles,
            totalDownloads: parseInt(totalDownloads.total) || 0,
        };
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_entity_1.File)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FilesService);
//# sourceMappingURL=files.service.js.map