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
exports.NewStructureController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const dossiers_service_1 = require("./dossiers.service");
const sous_dossiers_service_1 = require("./sous-dossiers.service");
const fichiers_service_1 = require("./fichiers.service");
const students_service_1 = require("../students/students.service");
const create_dossier_dto_1 = require("./dto/create-dossier.dto");
const create_sous_dossier_dto_1 = require("./dto/create-sous-dossier.dto");
const create_fichier_dto_1 = require("./dto/create-fichier.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const user_entity_1 = require("../users/entities/user.entity");
let NewStructureController = class NewStructureController {
    constructor(dossiersService, sousDossiersService, fichiersService, studentsService) {
        this.dossiersService = dossiersService;
        this.sousDossiersService = sousDossiersService;
        this.fichiersService = fichiersService;
        this.studentsService = studentsService;
    }
    async createDossier(createDossierDto, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent créer des dossiers');
        }
        return this.dossiersService.create(createDossierDto);
    }
    async findAllDossiers() {
        return this.dossiersService.findAll();
    }
    async findDossiersForStudent(req) {
        let userClass = req.user.class_level;
        if (!userClass) {
            const student = await this.studentsService.findByUserId(req.user.sub);
            userClass = student?.class_level || 'Terminale groupe 1';
        }
        console.log(`🔍 Étudiant ${req.user.email} - Classe: ${userClass}`);
        const allDossiers = await this.dossiersService.findAll();
        const accessibleDossiers = allDossiers.filter(dossier => {
            if (!dossier.target_class)
                return false;
            try {
                const targetClasses = JSON.parse(dossier.target_class);
                const isAccessible = Array.isArray(targetClasses) && targetClasses.includes(userClass);
                console.log(`📁 Dossier "${dossier.name}" (${dossier.target_class}) - Accessible: ${isAccessible}`);
                return isAccessible;
            }
            catch (error) {
                const isAccessible = dossier.target_class === userClass;
                console.log(`📁 Dossier "${dossier.name}" (${dossier.target_class}) - Accessible: ${isAccessible}`);
                return isAccessible;
            }
        });
        console.log(`✅ ${accessibleDossiers.length} dossiers accessibles pour ${userClass}`);
        return accessibleDossiers;
    }
    async findOneDossier(id) {
        const dossierId = parseInt(id);
        if (isNaN(dossierId)) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        return this.dossiersService.findOne(dossierId);
    }
    async updateDossier(id, updateData, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent modifier des dossiers');
        }
        const dossierId = parseInt(id);
        if (isNaN(dossierId)) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        return this.dossiersService.update(dossierId, updateData);
    }
    async removeDossier(id, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent supprimer des dossiers');
        }
        const dossierId = parseInt(id);
        if (isNaN(dossierId)) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        await this.dossiersService.remove(dossierId);
        return { message: 'Dossier supprimé avec succès' };
    }
    async createSousDossier(createSousDossierDto, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent créer des sous-dossiers');
        }
        return this.sousDossiersService.create(createSousDossierDto);
    }
    async findSousDossiersByDossier(dossierId) {
        const id = parseInt(dossierId);
        if (isNaN(id)) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        return this.sousDossiersService.findByDossier(id);
    }
    async findSousDossiersForStudent(id, req) {
        const dossierId = parseInt(id);
        if (isNaN(dossierId)) {
            throw new common_1.BadRequestException('ID de dossier invalide');
        }
        console.log(`🔍 [DEBUG] Student ${req.user.email} requesting sous-dossiers for dossier ${dossierId}`);
        console.log(`🔍 [DEBUG] User class_level from token:`, req.user.class_level);
        const dossier = await this.dossiersService.findOne(dossierId);
        if (!dossier) {
            console.log(`❌ [DEBUG] Dossier ${dossierId} not found`);
            throw new common_1.BadRequestException('Dossier non trouvé');
        }
        console.log(`🔍 [DEBUG] Dossier found:`, {
            id: dossier.id,
            name: dossier.name,
            target_class: dossier.target_class
        });
        const userClass = req.user.class_level || 'Terminale groupe 1';
        let hasAccess = false;
        if (dossier.target_class) {
            try {
                const targetClasses = JSON.parse(dossier.target_class);
                hasAccess = Array.isArray(targetClasses) && targetClasses.includes(userClass);
                console.log(`🔍 [DEBUG] Target classes (JSON):`, targetClasses);
                console.log(`🔍 [DEBUG] User class:`, userClass);
                console.log(`🔍 [DEBUG] Has access (JSON):`, hasAccess);
            }
            catch (error) {
                hasAccess = dossier.target_class === userClass;
                console.log(`🔍 [DEBUG] Target class (string):`, dossier.target_class);
                console.log(`🔍 [DEBUG] User class:`, userClass);
                console.log(`🔍 [DEBUG] Has access (string):`, hasAccess);
            }
        }
        else {
            console.log(`⚠️ [DEBUG] Dossier has no target_class set`);
        }
        if (!hasAccess) {
            console.log(`❌ [DEBUG] Access denied for student ${req.user.email} to dossier ${dossierId}`);
            throw new common_1.BadRequestException('Accès non autorisé à ce dossier');
        }
        console.log(`✅ [DEBUG] Access granted, fetching sous-dossiers for dossier ${dossierId}`);
        return this.sousDossiersService.findByDossier(dossierId);
    }
    async findOneSousDossier(id) {
        const sousDossierId = parseInt(id);
        if (isNaN(sousDossierId)) {
            throw new common_1.BadRequestException('ID de sous-dossier invalide');
        }
        return this.sousDossiersService.findOne(sousDossierId);
    }
    async updateSousDossier(id, updateData, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent modifier des sous-dossiers');
        }
        const sousDossierId = parseInt(id);
        if (isNaN(sousDossierId)) {
            throw new common_1.BadRequestException('ID de sous-dossier invalide');
        }
        return this.sousDossiersService.update(sousDossierId, updateData);
    }
    async removeSousDossier(id, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent supprimer des sous-dossiers');
        }
        const sousDossierId = parseInt(id);
        if (isNaN(sousDossierId)) {
            throw new common_1.BadRequestException('ID de sous-dossier invalide');
        }
        await this.sousDossiersService.remove(sousDossierId);
        return { message: 'Sous-dossier supprimé avec succès' };
    }
    async createFichier(createFichierDto, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent créer des fichiers');
        }
        return this.fichiersService.create(createFichierDto);
    }
    async findFichiersBySousDossier(sousDossierId) {
        const id = parseInt(sousDossierId);
        if (isNaN(id)) {
            throw new common_1.BadRequestException('ID de sous-dossier invalide');
        }
        return this.fichiersService.findBySousDossier(id);
    }
    async findFichiersForStudent(id, req) {
        const sousDossierId = parseInt(id);
        if (isNaN(sousDossierId)) {
            throw new common_1.BadRequestException('ID de sous-dossier invalide');
        }
        const sousDossier = await this.sousDossiersService.findOne(sousDossierId);
        if (!sousDossier) {
            throw new common_1.BadRequestException('Sous-dossier non trouvé');
        }
        const dossier = await this.dossiersService.findOne(sousDossier.dossier_id);
        if (!dossier) {
            throw new common_1.BadRequestException('Dossier parent non trouvé');
        }
        const userClass = req.user.class_level || 'Terminale groupe 1';
        let hasAccess = false;
        if (dossier.target_class) {
            try {
                const targetClasses = JSON.parse(dossier.target_class);
                hasAccess = Array.isArray(targetClasses) && targetClasses.includes(userClass);
            }
            catch (error) {
                hasAccess = dossier.target_class === userClass;
            }
        }
        if (!hasAccess) {
            throw new common_1.BadRequestException('Accès non autorisé à ce sous-dossier');
        }
        return this.fichiersService.findBySousDossier(sousDossierId);
    }
    async findOneFichier(id) {
        const fichierId = parseInt(id);
        if (isNaN(fichierId)) {
            throw new common_1.BadRequestException('ID de fichier invalide');
        }
        return this.fichiersService.findOne(fichierId);
    }
    async updateFichier(id, updateData, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent modifier des fichiers');
        }
        const fichierId = parseInt(id);
        if (isNaN(fichierId)) {
            throw new common_1.BadRequestException('ID de fichier invalide');
        }
        return this.fichiersService.update(fichierId, updateData);
    }
    async removeFichier(id, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent supprimer des fichiers');
        }
        const fichierId = parseInt(id);
        if (isNaN(fichierId)) {
            throw new common_1.BadRequestException('ID de fichier invalide');
        }
        await this.fichiersService.remove(fichierId);
        return { message: 'Fichier supprimé avec succès' };
    }
    async downloadFichier(id, res, req) {
        const fichierId = parseInt(id);
        if (isNaN(fichierId)) {
            throw new common_1.BadRequestException('ID de fichier invalide');
        }
        const fichier = await this.fichiersService.findOne(fichierId);
        if (!fichier) {
            throw new common_1.BadRequestException('Fichier non trouvé');
        }
        if (req.user.role === user_entity_1.UserRole.STUDENT) {
            const sousDossier = await this.sousDossiersService.findOne(fichier.sous_dossier_id);
            if (!sousDossier) {
                throw new common_1.BadRequestException('Sous-dossier parent non trouvé');
            }
            const dossier = await this.dossiersService.findOne(sousDossier.dossier_id);
            if (!dossier) {
                throw new common_1.BadRequestException('Dossier parent non trouvé');
            }
            const userClass = req.user.class_level || 'Terminale groupe 1';
            let hasAccess = false;
            if (dossier.target_class) {
                try {
                    const targetClasses = JSON.parse(dossier.target_class);
                    hasAccess = Array.isArray(targetClasses) && targetClasses.includes(userClass);
                }
                catch (error) {
                    hasAccess = dossier.target_class === userClass;
                }
            }
            if (!hasAccess) {
                throw new common_1.BadRequestException('Accès non autorisé à ce fichier');
            }
        }
        const filePath = path.join(process.cwd(), fichier.file_path);
        console.log('🔍 Recherche du fichier:', filePath);
        if (!fs.existsSync(filePath)) {
            console.log('❌ Fichier non trouvé:', filePath);
            throw new common_1.BadRequestException('Fichier non trouvé sur le serveur. Veuillez contacter l\'administrateur.');
        }
        await this.fichiersService.incrementDownloadCount(fichierId);
        const stats = fs.statSync(filePath);
        const ext = path.extname(fichier.file_name).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.pdf')
            contentType = 'application/pdf';
        else if (ext === '.jpg' || ext === '.jpeg')
            contentType = 'image/jpeg';
        else if (ext === '.png')
            contentType = 'image/png';
        else if (ext === '.gif')
            contentType = 'image/gif';
        else if (ext === '.mp4')
            contentType = 'video/mp4';
        else if (ext === '.mp3')
            contentType = 'audio/mpeg';
        else if (ext === '.doc')
            contentType = 'application/msword';
        else if (ext === '.docx')
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (ext === '.xls')
            contentType = 'application/vnd.ms-excel';
        else if (ext === '.xlsx')
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);
        const encodedFileName = encodeURIComponent(fichier.file_name);
        res.setHeader('Content-Disposition', `attachment; filename="${fichier.file_name}"; filename*=UTF-8''${encodedFileName}`);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
    async uploadFichier(file, title, description, sousDossierId, req) {
        if (req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Seuls les administrateurs peuvent uploader des fichiers');
        }
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        if (!title) {
            throw new common_1.BadRequestException('Le titre est requis');
        }
        if (!sousDossierId) {
            throw new common_1.BadRequestException('L\'ID du sous-dossier est requis');
        }
        const sousDossierIdNum = parseInt(sousDossierId);
        if (isNaN(sousDossierIdNum)) {
            throw new common_1.BadRequestException('ID de sous-dossier invalide');
        }
        const sousDossier = await this.sousDossiersService.findOne(sousDossierIdNum);
        if (!sousDossier) {
            throw new common_1.BadRequestException('Sous-dossier non trouvé');
        }
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.originalname.split('.').pop();
        const storedName = `${timestamp}_${randomString}.${fileExtension}`;
        const uploadDir = path.join(process.cwd(), 'uploads', 'fichiers');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const uploadPath = `uploads/fichiers/${storedName}`;
        const fullPath = path.join(process.cwd(), uploadPath);
        fs.writeFileSync(fullPath, file.buffer);
        const createFichierDto = {
            title,
            sous_dossier_id: sousDossierIdNum,
            description: description || '',
            file_name: file.originalname,
            stored_name: storedName,
            file_path: uploadPath,
            file_type: file.mimetype,
            file_size: file.size,
            download_count: 0
        };
        return this.fichiersService.create(createFichierDto);
    }
};
exports.NewStructureController = NewStructureController;
__decorate([
    (0, common_1.Post)('dossiers'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dossier_dto_1.CreateDossierDto, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "createDossier", null);
__decorate([
    (0, common_1.Get)('dossiers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findAllDossiers", null);
__decorate([
    (0, common_1.Get)('student/dossiers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findDossiersForStudent", null);
__decorate([
    (0, common_1.Get)('dossiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findOneDossier", null);
__decorate([
    (0, common_1.Patch)('dossiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "updateDossier", null);
__decorate([
    (0, common_1.Delete)('dossiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "removeDossier", null);
__decorate([
    (0, common_1.Post)('sous-dossiers'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sous_dossier_dto_1.CreateSousDossierDto, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "createSousDossier", null);
__decorate([
    (0, common_1.Get)('dossiers/:dossierId/sous-dossiers'),
    __param(0, (0, common_1.Param)('dossierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findSousDossiersByDossier", null);
__decorate([
    (0, common_1.Get)('student/dossiers/:id/sous-dossiers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findSousDossiersForStudent", null);
__decorate([
    (0, common_1.Get)('sous-dossiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findOneSousDossier", null);
__decorate([
    (0, common_1.Patch)('sous-dossiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "updateSousDossier", null);
__decorate([
    (0, common_1.Delete)('sous-dossiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "removeSousDossier", null);
__decorate([
    (0, common_1.Post)('fichiers'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fichier_dto_1.CreateFichierDto, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "createFichier", null);
__decorate([
    (0, common_1.Get)('sous-dossiers/:sousDossierId/fichiers'),
    __param(0, (0, common_1.Param)('sousDossierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findFichiersBySousDossier", null);
__decorate([
    (0, common_1.Get)('student/sous-dossiers/:id/fichiers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findFichiersForStudent", null);
__decorate([
    (0, common_1.Get)('fichiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "findOneFichier", null);
__decorate([
    (0, common_1.Patch)('fichiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "updateFichier", null);
__decorate([
    (0, common_1.Delete)('fichiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "removeFichier", null);
__decorate([
    (0, common_1.Get)('fichiers/:id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "downloadFichier", null);
__decorate([
    (0, common_1.Post)('fichiers/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('sous_dossier_id')),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NewStructureController.prototype, "uploadFichier", null);
exports.NewStructureController = NewStructureController = __decorate([
    (0, common_1.Controller)('new-structure'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [dossiers_service_1.DossiersService,
        sous_dossiers_service_1.SousDossiersService,
        fichiers_service_1.FichiersService,
        students_service_1.StudentsService])
], NewStructureController);
//# sourceMappingURL=new-structure.controller.js.map