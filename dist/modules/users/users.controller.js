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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const user_entity_1 = require("./entities/user.entity");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(role) {
        if (role) {
            return this.usersService.findByRole(role);
        }
        return this.usersService.findAll();
    }
    async debugAllUsers() {
        console.log('🔍 Debug: Listing all users with their IDs');
        const users = await this.usersService.findAll();
        console.log('🔍 All users:', users.map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email })));
        return users;
    }
    findOne(id) {
        return this.usersService.findById(parseInt(id));
    }
    async updateUser(id, updateData) {
        console.log('🔍 PUT /users/:id called with id:', id, 'and data:', updateData);
        try {
            const userId = parseInt(id);
            if (isNaN(userId)) {
                console.error('🔍 Invalid user ID:', id);
                throw new Error('ID utilisateur invalide');
            }
            const userUpdateData = {
                firstName: updateData.firstName,
                lastName: updateData.lastName,
                email: updateData.email,
                phone: updateData.phone_number || updateData.phone,
                is_active: updateData.isActive,
                is_approved: updateData.isApproved,
                email_verified: updateData.email_verified,
                last_login: updateData.last_login,
            };
            if (updateData.role === user_entity_1.UserRole.STUDENT) {
                userUpdateData.class_level = updateData.classLevel || updateData.class;
                userUpdateData.birth_date = updateData.birthDate || updateData.birth_date;
            }
            if (updateData.role === user_entity_1.UserRole.PARENT) {
                userUpdateData.parent_phone_number = updateData.phone_number || updateData.phone;
                userUpdateData.parent_address = updateData.address;
                userUpdateData.occupation = updateData.occupation;
            }
            console.log('🔍 Updating user with data:', userUpdateData);
            const result = await this.usersService.update(userId, userUpdateData);
            console.log('🔍 User updated successfully:', result);
            return result;
        }
        catch (error) {
            console.error('🔍 Error updating user:', error);
            console.error('🔍 Error stack:', error.stack);
            console.error('🔍 Error message:', error.message);
            throw error;
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('debug/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "debugAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map