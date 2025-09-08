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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["PARENT"] = "parent";
    UserRole["TEACHER"] = "teacher";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.STUDENT,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_approved', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_approved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verified', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "email_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verification_token', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "verification_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verification_token_expiry', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "verification_token_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verification_code', length: 6, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email_verification_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verification_code_expiry', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "email_verification_code_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_token', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password_reset_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_token_expiry', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "password_reset_token_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_code', length: 6, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password_reset_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_code_expiry', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "password_reset_code_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "last_login", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('Student', 'user'),
    __metadata("design:type", Object)
], User.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('Parent', 'user'),
    __metadata("design:type", Object)
], User.prototype, "parent", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map