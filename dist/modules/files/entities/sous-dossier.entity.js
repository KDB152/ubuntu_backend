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
exports.SousDossier = void 0;
const typeorm_1 = require("typeorm");
const dossier_entity_1 = require("./dossier.entity");
const fichier_entity_1 = require("./fichier.entity");
let SousDossier = class SousDossier {
};
exports.SousDossier = SousDossier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SousDossier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, comment: 'Nom du sous-dossier' }),
    __metadata("design:type", String)
], SousDossier.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', comment: 'ID du dossier parent (dossiers)' }),
    __metadata("design:type", Number)
], SousDossier.prototype, "dossier_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: 'Description du sous-dossier' }),
    __metadata("design:type", String)
], SousDossier.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, comment: 'ID du sous-dossier parent (pour hiérarchie)' }),
    __metadata("design:type", Number)
], SousDossier.prototype, "sous_dossier_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SousDossier.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SousDossier.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dossier_entity_1.Dossier, dossier => dossier.sous_dossiers),
    (0, typeorm_1.JoinColumn)({ name: 'dossier_id' }),
    __metadata("design:type", dossier_entity_1.Dossier)
], SousDossier.prototype, "dossier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SousDossier, sousDossier => sousDossier.children),
    (0, typeorm_1.JoinColumn)({ name: 'sous_dossier_id' }),
    __metadata("design:type", SousDossier)
], SousDossier.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SousDossier, sousDossier => sousDossier.parent),
    __metadata("design:type", Array)
], SousDossier.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => fichier_entity_1.Fichier, fichier => fichier.sous_dossier),
    __metadata("design:type", Array)
], SousDossier.prototype, "fichiers", void 0);
exports.SousDossier = SousDossier = __decorate([
    (0, typeorm_1.Entity)('sous_dossiers')
], SousDossier);
//# sourceMappingURL=sous-dossier.entity.js.map