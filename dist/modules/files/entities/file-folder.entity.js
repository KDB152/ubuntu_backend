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
exports.FileFolder = void 0;
const typeorm_1 = require("typeorm");
const file_entity_1 = require("./file.entity");
const folder_entity_1 = require("./folder.entity");
let FileFolder = class FileFolder {
};
exports.FileFolder = FileFolder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FileFolder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_id', type: 'int', comment: 'ID du fichier' }),
    __metadata("design:type", Number)
], FileFolder.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'folder_id', type: 'int', comment: 'ID du dossier' }),
    __metadata("design:type", Number)
], FileFolder.prototype, "folderId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: 'Date d\'ajout du fichier au dossier' }),
    __metadata("design:type", Date)
], FileFolder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => file_entity_1.File, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'file_id' }),
    __metadata("design:type", file_entity_1.File)
], FileFolder.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => folder_entity_1.Folder, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'folder_id' }),
    __metadata("design:type", folder_entity_1.Folder)
], FileFolder.prototype, "folder", void 0);
exports.FileFolder = FileFolder = __decorate([
    (0, typeorm_1.Entity)('file_folders')
], FileFolder);
//# sourceMappingURL=file-folder.entity.js.map