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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const files_service_1 = require("./files.service");
const folders_service_1 = require("./folders.service");
const create_file_dto_1 = require("./dto/create-file.dto");
const update_file_dto_1 = require("./dto/update-file.dto");
const create_folder_dto_1 = require("./dto/create-folder.dto");
const update_folder_dto_1 = require("./dto/update-folder.dto");
const add_file_to_folder_dto_1 = require("./dto/add-file-to-folder.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const user_entity_1 = require("../users/entities/user.entity");
const path = require("path");
const fs = require("fs");
let FilesController = class FilesController {
    constructor(filesService, foldersService) {
        this.filesService = filesService;
        this.foldersService = foldersService;
    }
    async create(createFileDto, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent uploader des fichiers');
        }
        return this.filesService.create(createFileDto, req.user.id);
    }
    async uploadFile(file, title, description, req) {
        try {
            console.log('📤 Upload de fichier - Données reçues:', {
                title,
                description,
                fileName: file?.originalname,
                fileSize: file?.size,
                userRole: req.user?.role
            });
            if (req.user.role !== user_entity_1.UserRole.ADMIN) {
                throw new common_1.BadRequestException('Seuls les administrateurs peuvent uploader des fichiers');
            }
            if (!file) {
                throw new common_1.BadRequestException('Aucun fichier fourni');
            }
            if (!title) {
                throw new common_1.BadRequestException('Le titre est requis');
            }
            const uploadsDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            const fileExtension = path.extname(file.originalname);
            const fileName = path.basename(file.originalname, fileExtension);
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const storedName = `file-${timestamp}-${randomSuffix}-${fileName}${fileExtension}`;
            const filePath = path.join('uploads', storedName);
            const fullPath = path.join(process.cwd(), filePath);
            fs.writeFileSync(fullPath, file.buffer);
            console.log('✅ Fichier sauvegardé:', fullPath);
            const createFileDto = {
                title,
                description: description || '',
                fileName: file.originalname,
                storedName,
                filePath,
                fileType: file.mimetype,
                fileSize: file.size,
                isPublic: true
            };
            console.log('📝 Création du DTO:', {
                title: createFileDto.title,
                description: createFileDto.description
            });
            const createdFile = await this.filesService.create(createFileDto, req.user.id);
            console.log('✅ Fichier créé en base:', createdFile.id);
            return {
                success: true,
                file: createdFile,
                filePath
            };
        }
        catch (error) {
            console.error('❌ Erreur lors de l\'upload:', error);
            throw new common_1.BadRequestException(`Erreur lors de l'upload: ${error.message}`);
        }
    }
    async findAll(req) {
        if (req.user.role === user_entity_1.UserRole.ADMIN) {
            return this.filesService.findAll();
        }
        else if (req.user.role === user_entity_1.UserRole.STUDENT) {
            return this.filesService.findAll();
        }
        throw new common_1.BadRequestException('Rôle non autorisé');
    }
    async getStats(req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent voir les statistiques');
        }
        return this.filesService.getFileStats();
    }
    async download(id, res, req) {
        const file = await this.filesService.findOne(+id);
        if (!file) {
            throw new common_1.BadRequestException('Fichier non trouvé');
        }
        if (req.user.role === user_entity_1.UserRole.STUDENT) {
        }
        let filePath;
        const normalizedFilePath = file.filePath.replace(/\\/g, '/');
        if (normalizedFilePath.startsWith('uploads/')) {
            filePath = path.join(process.cwd(), normalizedFilePath);
        }
        else {
            filePath = path.join(process.cwd(), 'uploads', normalizedFilePath);
        }
        console.log('🔍 Recherche du fichier:', filePath);
        if (!fs.existsSync(filePath)) {
            console.log('❌ Fichier non trouvé:', filePath);
            throw new common_1.BadRequestException('Fichier non trouvé sur le serveur. Veuillez contacter l\'administrateur.');
        }
        await this.filesService.incrementDownloadCount(+id);
        const stats = fs.statSync(filePath);
        if (stats.size !== file.fileSize) {
            console.log(`⚠️ Incohérence de taille détectée pour le fichier ${file.id}:`);
            console.log(`   Base de données: ${file.fileSize} bytes`);
            console.log(`   Fichier physique: ${stats.size} bytes`);
            await this.filesService.update(+id, { fileSize: stats.size });
            console.log(`✅ Taille mise à jour en base de données`);
        }
        let contentType = file.fileType || 'application/octet-stream';
        if (file.fileType === 'application/x-msdownload' || file.fileName.endsWith('.exe')) {
            contentType = 'application/octet-stream';
        }
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);
        const encodedFileName = encodeURIComponent(file.fileName);
        res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"; filename*=UTF-8''${encodedFileName}`);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        console.log(`📥 Téléchargement du fichier: ${file.fileName} (${stats.size} bytes)`);
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', (error) => {
            console.error('❌ Erreur lors de la lecture du fichier:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Erreur lors de la lecture du fichier' });
            }
        });
        fileStream.pipe(res);
    }
    async update(id, updateFileDto, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent modifier les fichiers');
        }
        return this.filesService.update(+id, updateFileDto);
    }
    async remove(id, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent supprimer les fichiers');
        }
        await this.filesService.remove(+id);
        return { message: 'Fichier supprimé avec succès' };
    }
    async createFolder(createFolderDto, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent créer des dossiers');
        }
        return this.foldersService.create(createFolderDto, req.user.id);
    }
    async getFolders(req) {
        console.log('🔍 getFolders - req.user:', req.user);
        console.log('🔍 getFolders - req.user.role:', req.user?.role);
        if (!req.user) {
            throw new common_1.BadRequestException('Utilisateur non authentifié');
        }
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent voir les dossiers');
        }
        try {
            console.log('📁 Récupération des dossiers...');
            const folders = await this.foldersService.findAll();
            console.log('📁 Dossiers trouvés:', folders.length);
            return folders;
        }
        catch (error) {
            console.error('❌ Erreur dans getFolders:', error);
            throw error;
        }
    }
    async testFolders() {
        try {
            console.log('🧪 Test des dossiers sans authentification...');
            const folders = await this.foldersService.findAll();
            console.log('✅ Test réussi - Dossiers trouvés:', folders.length);
            return { success: true, count: folders.length, folders };
        }
        catch (error) {
            console.error('❌ Erreur dans testFolders:', error);
            return { success: false, error: error.message };
        }
    }
    async debugFolders(req) {
        console.log('🔍 Debug - req.user:', req.user);
        console.log('🔍 Debug - req.headers:', req.headers);
        return {
            user: req.user,
            hasAuth: !!req.user,
            role: req.user?.role,
            headers: req.headers
        };
    }
    async getFoldersPublic() {
        try {
            console.log('🌐 Récupération des dossiers (public)...');
            const folders = await this.foldersService.findAll();
            console.log('🌐 Dossiers trouvés:', folders.length);
            return folders;
        }
        catch (error) {
            console.error('❌ Erreur dans getFoldersPublic:', error);
            throw error;
        }
    }
    async getFolderTree(req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent voir l\'arborescence des dossiers');
        }
        return this.foldersService.getFolderTree();
    }
    async getFolder(id, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent voir les dossiers');
        }
        const folderId = parseInt(id);
        if (isNaN(folderId) || folderId < 1) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        return this.foldersService.findOne(folderId);
    }
    async getFolderContents(id, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent voir le contenu des dossiers');
        }
        const folderId = parseInt(id);
        if (isNaN(folderId) || folderId < 1) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        return this.foldersService.getFolderContents(folderId);
    }
    async updateFolder(id, updateFolderDto, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent modifier les dossiers');
        }
        return this.foldersService.update(+id, updateFolderDto);
    }
    async removeFolder(id, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent supprimer les dossiers');
        }
        await this.foldersService.remove(+id);
        return { message: 'Dossier supprimé avec succès' };
    }
    async addFilesToFolder(id, addFileToFolderDto, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent ajouter des fichiers aux dossiers');
        }
        await this.foldersService.addFilesToFolder(+id, addFileToFolderDto);
        return { message: 'Fichiers ajoutés au dossier avec succès' };
    }
    async removeFileFromFolder(folderId, fileId, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent retirer des fichiers des dossiers');
        }
        await this.foldersService.removeFileFromFolder(+folderId, +fileId);
        return { message: 'Fichier retiré du dossier avec succès' };
    }
    async findOne(id, req) {
        const fileId = parseInt(id);
        if (isNaN(fileId) || fileId < 1) {
            throw new common_1.BadRequestException('ID de fichier invalide');
        }
        const file = await this.filesService.findOne(fileId);
        if (req.user && req.user.role === user_entity_1.UserRole.STUDENT) {
        }
        return file;
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_file_dto_1.CreateFileDto, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "download", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_file_dto_1.UpdateFileDto, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('folders'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_folder_dto_1.CreateFolderDto, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Get)('folders'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFolders", null);
__decorate([
    (0, common_1.Get)('folders/test'),
    (0, common_1.UseGuards)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "testFolders", null);
__decorate([
    (0, common_1.Get)('folders/debug'),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "debugFolders", null);
__decorate([
    (0, common_1.Get)('folders/public'),
    (0, common_1.UseGuards)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFoldersPublic", null);
__decorate([
    (0, common_1.Get)('folders/tree'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFolderTree", null);
__decorate([
    (0, common_1.Get)('folders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFolder", null);
__decorate([
    (0, common_1.Get)('folders/:id/contents'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFolderContents", null);
__decorate([
    (0, common_1.Patch)('folders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_folder_dto_1.UpdateFolderDto, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "updateFolder", null);
__decorate([
    (0, common_1.Delete)('folders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "removeFolder", null);
__decorate([
    (0, common_1.Post)('folders/:id/files'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_file_to_folder_dto_1.AddFileToFolderDto, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "addFilesToFolder", null);
__decorate([
    (0, common_1.Delete)('folders/:folderId/files/:fileId'),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, common_1.Param)('fileId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "removeFileFromFolder", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "findOne", null);
exports.FilesController = FilesController = __decorate([
    (0, common_1.Controller)('files'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [files_service_1.FilesService,
        folders_service_1.FoldersService])
], FilesController);
//# sourceMappingURL=files.controller.js.map