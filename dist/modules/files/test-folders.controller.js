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
exports.TestFoldersController = void 0;
const common_1 = require("@nestjs/common");
const folders_service_1 = require("./folders.service");
let TestFoldersController = class TestFoldersController {
    constructor(foldersService) {
        this.foldersService = foldersService;
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
};
exports.TestFoldersController = TestFoldersController;
__decorate([
    (0, common_1.Get)('folders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestFoldersController.prototype, "testFolders", null);
exports.TestFoldersController = TestFoldersController = __decorate([
    (0, common_1.Controller)('test'),
    __metadata("design:paramtypes", [folders_service_1.FoldersService])
], TestFoldersController);
//# sourceMappingURL=test-folders.controller.js.map