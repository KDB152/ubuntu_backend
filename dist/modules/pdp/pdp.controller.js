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
exports.PdpController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const pdp_service_1 = require("./pdp.service");
const fs = require("fs");
let PdpController = class PdpController {
    constructor(pdpService) {
        this.pdpService = pdpService;
    }
    async uploadProfilePicture(req, file) {
        if (!file) {
            throw new Error('Aucun fichier fourni');
        }
        const userId = req.user.id;
        const pdp = await this.pdpService.uploadProfilePicture(userId, file);
        return {
            success: true,
            message: 'Photo de profil uploadée avec succès',
            data: {
                id: pdp.id,
                fileName: pdp.fileName,
                fileType: pdp.fileType,
                fileSize: pdp.fileSize,
                url: await this.pdpService.getProfilePictureUrl(userId)
            }
        };
    }
    async getMyProfilePicture(req) {
        const userId = req.user.id;
        const pdp = await this.pdpService.getProfilePicture(userId);
        if (!pdp) {
            return {
                success: false,
                message: 'Aucune photo de profil trouvée',
                data: null
            };
        }
        return {
            success: true,
            data: {
                id: pdp.id,
                fileName: pdp.fileName,
                fileType: pdp.fileType,
                fileSize: pdp.fileSize,
                url: await this.pdpService.getProfilePictureUrl(userId),
                createdAt: pdp.createdAt
            }
        };
    }
    async getUserProfilePicture(userId) {
        const pdp = await this.pdpService.getProfilePicture(userId);
        if (!pdp) {
            return {
                success: false,
                message: 'Aucune photo de profil trouvée',
                data: null
            };
        }
        return {
            success: true,
            data: {
                id: pdp.id,
                fileName: pdp.fileName,
                fileType: pdp.fileType,
                fileSize: pdp.fileSize,
                url: await this.pdpService.getProfilePictureUrl(userId),
                createdAt: pdp.createdAt
            }
        };
    }
    async serveProfilePicture(userId, res) {
        const pdp = await this.pdpService.getProfilePicture(userId);
        if (!pdp || !fs.existsSync(pdp.filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Photo de profil non trouvée'
            });
        }
        let contentType = 'image/jpeg';
        switch (pdp.fileType) {
            case 'PNG':
                contentType = 'image/png';
                break;
            case 'SVG':
                contentType = 'image/svg+xml';
                break;
            case 'GIF':
                contentType = 'image/gif';
                break;
            case 'WebP':
                contentType = 'image/webp';
                break;
        }
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        const fileStream = fs.createReadStream(pdp.filePath);
        fileStream.pipe(res);
    }
    async deleteMyProfilePicture(req) {
        const userId = req.user.id;
        await this.pdpService.deleteProfilePicture(userId);
        return {
            success: true,
            message: 'Photo de profil supprimée avec succès'
        };
    }
};
exports.PdpController = PdpController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PdpController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdpController.prototype, "getMyProfilePicture", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PdpController.prototype, "getUserProfilePicture", null);
__decorate([
    (0, common_1.Get)('serve/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PdpController.prototype, "serveProfilePicture", null);
__decorate([
    (0, common_1.Delete)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdpController.prototype, "deleteMyProfilePicture", null);
exports.PdpController = PdpController = __decorate([
    (0, common_1.Controller)('pdp'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pdp_service_1.PdpService])
], PdpController);
//# sourceMappingURL=pdp.controller.js.map