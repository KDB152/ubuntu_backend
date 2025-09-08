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
exports.PdpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pdp_entity_1 = require("./entities/pdp.entity");
const user_entity_1 = require("../users/entities/user.entity");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
let PdpService = class PdpService {
    constructor(pdpRepository, userRepository) {
        this.pdpRepository = pdpRepository;
        this.userRepository = userRepository;
        this.uploadPath = path.join(__dirname, '..', '..', '..', 'uploads', 'profiles');
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }
    async uploadProfilePicture(userId, file) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, SVG, GIF, WebP');
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Fichier trop volumineux. Taille maximum: 10 Mo');
        }
        await this.deleteProfilePicture(userId);
        const fileExtension = path.extname(file.originalname);
        const storedName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const filePath = path.join(this.uploadPath, storedName);
        console.log('📁 Chemin d\'upload:', this.uploadPath);
        console.log('📁 Chemin complet du fichier:', filePath);
        console.log('📁 Dossier existe:', fs.existsSync(this.uploadPath));
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
            console.log('📁 Dossier créé:', this.uploadPath);
        }
        fs.writeFileSync(filePath, file.buffer);
        console.log('💾 Fichier sauvegardé:', filePath);
        let fileType;
        switch (file.mimetype) {
            case 'image/jpeg':
                fileType = 'JPEG';
                break;
            case 'image/png':
                fileType = 'PNG';
                break;
            case 'image/svg+xml':
                fileType = 'SVG';
                break;
            case 'image/gif':
                fileType = 'GIF';
                break;
            case 'image/webp':
                fileType = 'WebP';
                break;
            default:
                throw new common_1.BadRequestException('Type de fichier non reconnu');
        }
        const pdp = this.pdpRepository.create({
            userId,
            fileName: file.originalname,
            storedName,
            filePath,
            fileType,
            fileSize: file.size,
        });
        return await this.pdpRepository.save(pdp);
    }
    async getProfilePicture(userId) {
        return await this.pdpRepository.findOne({ where: { userId } });
    }
    async deleteProfilePicture(userId) {
        const pdp = await this.pdpRepository.findOne({ where: { userId } });
        if (pdp) {
            if (fs.existsSync(pdp.filePath)) {
                fs.unlinkSync(pdp.filePath);
            }
            await this.pdpRepository.remove(pdp);
        }
    }
    async getProfilePicturePath(userId) {
        const pdp = await this.getProfilePicture(userId);
        return pdp ? pdp.filePath : null;
    }
    async getProfilePictureUrl(userId) {
        const pdp = await this.getProfilePicture(userId);
        if (!pdp)
            return null;
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        return `${backendUrl}/uploads/profiles/${pdp.storedName}`;
    }
};
exports.PdpService = PdpService;
exports.PdpService = PdpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pdp_entity_1.Pdp)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PdpService);
//# sourceMappingURL=pdp.service.js.map