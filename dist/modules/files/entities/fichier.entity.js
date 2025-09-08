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
exports.Fichier = void 0;
const typeorm_1 = require("typeorm");
const sous_dossier_entity_1 = require("./sous-dossier.entity");
let Fichier = class Fichier {
};
exports.Fichier = Fichier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Fichier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, comment: 'Titre du fichier' }),
    __metadata("design:type", String)
], Fichier.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', comment: 'ID du sous-dossier parent' }),
    __metadata("design:type", Number)
], Fichier.prototype, "sous_dossier_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: 'Description du fichier' }),
    __metadata("design:type", String)
], Fichier.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, comment: 'Nom du fichier original' }),
    __metadata("design:type", String)
], Fichier.prototype, "file_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, comment: 'Nom de stockage' }),
    __metadata("design:type", String)
], Fichier.prototype, "stored_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, comment: 'Chemin du fichier' }),
    __metadata("design:type", String)
], Fichier.prototype, "file_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, comment: 'Type MIME du fichier' }),
    __metadata("design:type", String)
], Fichier.prototype, "file_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', comment: 'Taille du fichier en bytes' }),
    __metadata("design:type", Number)
], Fichier.prototype, "file_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, comment: 'Nombre de téléchargements' }),
    __metadata("design:type", Number)
], Fichier.prototype, "download_count", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Fichier.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Fichier.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sous_dossier_entity_1.SousDossier, sousDossier => sousDossier.fichiers),
    (0, typeorm_1.JoinColumn)({ name: 'sous_dossier_id' }),
    __metadata("design:type", sous_dossier_entity_1.SousDossier)
], Fichier.prototype, "sous_dossier", void 0);
exports.Fichier = Fichier = __decorate([
    (0, typeorm_1.Entity)('fichiers')
], Fichier);
//# sourceMappingURL=fichier.entity.js.map