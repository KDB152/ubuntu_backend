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
exports.Folder = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const file_folder_entity_1 = require("./file-folder.entity");
let Folder = class Folder {
};
exports.Folder = Folder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Folder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, comment: 'Nom du dossier' }),
    __metadata("design:type", String)
], Folder.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: 'Description du dossier' }),
    __metadata("design:type", String)
], Folder.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', type: 'int', nullable: true, comment: 'ID du dossier parent (null pour la racine)' }),
    __metadata("design:type", Number)
], Folder.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', comment: 'ID de l\'utilisateur qui a créé le dossier' }),
    __metadata("design:type", Number)
], Folder.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_global', type: 'boolean', default: false, comment: 'Dossier global accessible à tous' }),
    __metadata("design:type", Boolean)
], Folder.prototype, "isGlobal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'target_classes',
        type: 'json',
        nullable: true,
        comment: 'Classes cibles du dossier (JSON array)',
        transformer: {
            to: (value) => value ? JSON.stringify(value) : null,
            from: (value) => {
                if (typeof value === 'string') {
                    try {
                        return JSON.parse(value);
                    }
                    catch {
                        return [];
                    }
                }
                return Array.isArray(value) ? value : [];
            }
        }
    }),
    __metadata("design:type", Array)
], Folder.prototype, "targetClasses", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true, comment: 'Dossier actif ou supprimé' }),
    __metadata("design:type", Boolean)
], Folder.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: 'Date de création' }),
    __metadata("design:type", Date)
], Folder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: 'Date de mise à jour' }),
    __metadata("design:type", Date)
], Folder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Folder.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Folder, folder => folder.children, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Folder)
], Folder.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Folder, folder => folder.parent),
    __metadata("design:type", Array)
], Folder.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => file_folder_entity_1.FileFolder, fileFolder => fileFolder.folder),
    __metadata("design:type", Array)
], Folder.prototype, "fileFolders", void 0);
exports.Folder = Folder = __decorate([
    (0, typeorm_1.Entity)('folders')
], Folder);
//# sourceMappingURL=folder.entity.js.map