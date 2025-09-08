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
exports.RendezVousController = void 0;
const common_1 = require("@nestjs/common");
const rendez_vous_service_1 = require("./rendez-vous.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let RendezVousController = class RendezVousController {
    constructor(rendezVousService) {
        this.rendezVousService = rendezVousService;
    }
    async getRendezVous(req, parentId, status) {
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        if (parentId) {
            return this.rendezVousService.getRendezVousByParentId(parentId, status);
        }
        if (currentUserRole === 'admin') {
            return this.rendezVousService.getAllRendezVous(status);
        }
        else if (currentUserRole === 'parent') {
            return this.rendezVousService.getRendezVousByParentId(currentUserId.toString(), status);
        }
        return [];
    }
};
exports.RendezVousController = RendezVousController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('parentId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], RendezVousController.prototype, "getRendezVous", null);
exports.RendezVousController = RendezVousController = __decorate([
    (0, common_1.Controller)('api/rendez-vous'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [rendez_vous_service_1.RendezVousService])
], RendezVousController);
//# sourceMappingURL=rendez-vous.controller.js.map