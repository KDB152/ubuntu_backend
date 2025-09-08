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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrulyPublicFoldersController = void 0;
const common_1 = require("@nestjs/common");
const folders_service_1 = require("./folders.service");
let TrulyPublicFoldersController = class TrulyPublicFoldersController {
    constructor(foldersService) {
        this.foldersService = foldersService;
    }
    async getFolders() {
        try {
            console.log('🌐 Récupération des dossiers (vraiment public)...');
            const folders = await this.foldersService.findAll();
            console.log('🌐 Dossiers trouvés:', folders.length);
            return folders;
        }
        catch (error) {
            console.error('❌ Erreur dans getFolders (public):', error);
            throw error;
        }
    }
};
exports.TrulyPublicFoldersController = TrulyPublicFoldersController;
__decorate([
    (0, common_1.Get)('folders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrulyPublicFoldersController.prototype, "getFolders", null);
exports.TrulyPublicFoldersController = TrulyPublicFoldersController = __decorate([
    (0, common_1.Controller)('api/public'),
    __metadata("design:paramtypes", [folders_service_1.FoldersService])
], TrulyPublicFoldersController);
//# sourceMappingURL=truly-public-folders.controller.js.map