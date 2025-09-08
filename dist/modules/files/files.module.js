"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const files_service_1 = require("./files.service");
const folders_service_1 = require("./folders.service");
const dossiers_service_1 = require("./dossiers.service");
const sous_dossiers_service_1 = require("./sous-dossiers.service");
const fichiers_service_1 = require("./fichiers.service");
const students_service_1 = require("../students/students.service");
const files_controller_1 = require("./files.controller");
const test_folders_controller_1 = require("./test-folders.controller");
const public_folders_controller_1 = require("./public-folders.controller");
const truly_public_folders_controller_1 = require("./truly-public-folders.controller");
const new_structure_controller_1 = require("./new-structure.controller");
const file_entity_1 = require("./entities/file.entity");
const folder_entity_1 = require("./entities/folder.entity");
const file_folder_entity_1 = require("./entities/file-folder.entity");
const dossier_entity_1 = require("./entities/dossier.entity");
const sous_dossier_entity_1 = require("./entities/sous-dossier.entity");
const fichier_entity_1 = require("./entities/fichier.entity");
const student_entity_1 = require("../students/entities/student.entity");
let FilesModule = class FilesModule {
};
exports.FilesModule = FilesModule;
exports.FilesModule = FilesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([file_entity_1.File, folder_entity_1.Folder, file_folder_entity_1.FileFolder, dossier_entity_1.Dossier, sous_dossier_entity_1.SousDossier, fichier_entity_1.Fichier, student_entity_1.Student])],
        controllers: [files_controller_1.FilesController, test_folders_controller_1.TestFoldersController, public_folders_controller_1.PublicFoldersController, truly_public_folders_controller_1.TrulyPublicFoldersController, new_structure_controller_1.NewStructureController],
        providers: [files_service_1.FilesService, folders_service_1.FoldersService, dossiers_service_1.DossiersService, sous_dossiers_service_1.SousDossiersService, fichiers_service_1.FichiersService, students_service_1.StudentsService],
        exports: [files_service_1.FilesService, folders_service_1.FoldersService, dossiers_service_1.DossiersService, sous_dossiers_service_1.SousDossiersService, fichiers_service_1.FichiersService],
    })
], FilesModule);
//# sourceMappingURL=files.module.js.map