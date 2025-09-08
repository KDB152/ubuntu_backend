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
exports.Conversation = void 0;
const typeorm_1 = require("typeorm");
const groupe_entity_1 = require("./groupe.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let Conversation = class Conversation {
};
exports.Conversation = Conversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Conversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'groupe_id', nullable: true }),
    __metadata("design:type", Number)
], Conversation.prototype, "groupe_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_message_id', nullable: true }),
    __metadata("design:type", Number)
], Conversation.prototype, "last_message_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'direct' }),
    __metadata("design:type", String)
], Conversation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'participant1_id', nullable: true }),
    __metadata("design:type", Number)
], Conversation.prototype, "participant1_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'participant2_id', nullable: true }),
    __metadata("design:type", Number)
], Conversation.prototype, "participant2_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'class_level', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "class_level", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Conversation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Conversation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => groupe_entity_1.Groupe, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'groupe_id' }),
    __metadata("design:type", groupe_entity_1.Groupe)
], Conversation.prototype, "groupe", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'participant1_id' }),
    __metadata("design:type", user_entity_1.User)
], Conversation.prototype, "participant1", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'participant2_id' }),
    __metadata("design:type", user_entity_1.User)
], Conversation.prototype, "participant2", void 0);
exports.Conversation = Conversation = __decorate([
    (0, typeorm_1.Entity)('conversation')
], Conversation);
//# sourceMappingURL=conversation.entity.js.map