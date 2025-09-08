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
exports.FoldersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const folder_entity_1 = require("./entities/folder.entity");
const file_folder_entity_1 = require("./entities/file-folder.entity");
const file_entity_1 = require("./entities/file.entity");
let FoldersService = class FoldersService {
    constructor(foldersRepository, fileFoldersRepository, filesRepository) {
        this.foldersRepository = foldersRepository;
        this.fileFoldersRepository = fileFoldersRepository;
        this.filesRepository = filesRepository;
    }
    async create(createFolderDto, createdBy) {
        if (createFolderDto.parentId) {
            const parentFolder = await this.foldersRepository.findOne({
                where: { id: createFolderDto.parentId, isActive: true }
            });
            if (!parentFolder) {
                throw new common_1.NotFoundException('Dossier parent non trouvé');
            }
        }
        const folder = this.foldersRepository.create({
            ...createFolderDto,
            createdBy,
        });
        return this.foldersRepository.save(folder);
    }
    async findAll() {
        console.log('🔍 findAll() - Début de la requête');
        try {
            const folders = await this.foldersRepository.find({
                where: { isActive: true },
                order: { createdAt: 'DESC' },
            });
            console.log('✅ findAll() - Dossiers trouvés:', folders.length);
            return folders;
        }
        catch (error) {
            console.error('❌ findAll() - Erreur:', error.message);
            console.error('❌ findAll() - Stack:', error.stack);
            throw error;
        }
    }
    async findByParent(parentId) {
        if (parentId !== null && (isNaN(parentId) || parentId < 0)) {
            throw new common_1.BadRequestException('ID de dossier parent invalide');
        }
        const whereCondition = parentId === null
            ? { parentId: null, isActive: true }
            : { parentId, isActive: true };
        return this.foldersRepository.find({
            where: whereCondition,
            relations: ['creator', 'parent', 'children'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        if (isNaN(id) || id < 0) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        const folder = await this.foldersRepository.findOne({
            where: { id, isActive: true },
            relations: ['creator', 'parent', 'children', 'fileFolders', 'fileFolders.file'],
        });
        if (!folder) {
            throw new common_1.NotFoundException(`Dossier avec l'ID ${id} non trouvé`);
        }
        return folder;
    }
    async update(id, updateFolderDto) {
        const folder = await this.findOne(id);
        if (updateFolderDto.parentId) {
            const parentFolder = await this.foldersRepository.findOne({
                where: { id: updateFolderDto.parentId, isActive: true }
            });
            if (!parentFolder) {
                throw new common_1.NotFoundException('Dossier parent non trouvé');
            }
            if (updateFolderDto.parentId === id) {
                throw new common_1.BadRequestException('Un dossier ne peut pas être son propre parent');
            }
        }
        Object.assign(folder, updateFolderDto);
        return this.foldersRepository.save(folder);
    }
    async remove(id) {
        const folder = await this.findOne(id);
        const children = await this.foldersRepository.find({
            where: { parentId: id, isActive: true }
        });
        if (children.length > 0) {
            throw new common_1.BadRequestException('Impossible de supprimer un dossier contenant des sous-dossiers');
        }
        await this.fileFoldersRepository.delete({ folderId: id });
        folder.isActive = false;
        await this.foldersRepository.save(folder);
    }
    async addFilesToFolder(folderId, addFileToFolderDto) {
        const folder = await this.findOne(folderId);
        const files = await this.filesRepository.find({
            where: addFileToFolderDto.fileIds.map(id => ({ id, isActive: true }))
        });
        if (files.length !== addFileToFolderDto.fileIds.length) {
            throw new common_1.BadRequestException('Un ou plusieurs fichiers non trouvés');
        }
        const fileFolders = addFileToFolderDto.fileIds.map(fileId => this.fileFoldersRepository.create({
            fileId,
            folderId,
        }));
        await this.fileFoldersRepository.save(fileFolders);
    }
    async removeFileFromFolder(folderId, fileId) {
        const fileFolder = await this.fileFoldersRepository.findOne({
            where: { folderId, fileId }
        });
        if (!fileFolder) {
            throw new common_1.NotFoundException('Fichier non trouvé dans ce dossier');
        }
        await this.fileFoldersRepository.remove(fileFolder);
    }
    async getFolderContents(folderId) {
        if (isNaN(folderId) || folderId < 0) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        const folder = await this.findOne(folderId);
        const folders = await this.foldersRepository.find({
            where: { parentId: folderId, isActive: true },
            relations: ['creator'],
            order: { name: 'ASC' },
        });
        const fileFolders = await this.fileFoldersRepository.find({
            where: { folderId },
            relations: ['file', 'file.uploader'],
        });
        const files = fileFolders.map(ff => ff.file);
        return { folders, files };
    }
    async getFolderTree() {
        const rootFolders = await this.foldersRepository.find({
            where: { parentId: null, isActive: true },
            relations: ['creator', 'children'],
            order: { name: 'ASC' },
        });
        const loadChildren = async (folders) => {
            for (const folder of folders) {
                folder.children = await this.foldersRepository.find({
                    where: { parentId: folder.id, isActive: true },
                    relations: ['creator'],
                    order: { name: 'ASC' },
                });
                if (folder.children.length > 0) {
                    await loadChildren(folder.children);
                }
            }
            return folders;
        };
        return loadChildren(rootFolders);
    }
};
exports.FoldersService = FoldersService;
exports.FoldersService = FoldersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(folder_entity_1.Folder)),
    __param(1, (0, typeorm_1.InjectRepository)(file_folder_entity_1.FileFolder)),
    __param(2, (0, typeorm_1.InjectRepository)(file_entity_1.File)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FoldersService);
//# sourceMappingURL=folders.service.js.map