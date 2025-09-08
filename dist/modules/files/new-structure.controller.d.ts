import { Response } from 'express';
import { DossiersService } from './dossiers.service';
import { SousDossiersService } from './sous-dossiers.service';
import { FichiersService } from './fichiers.service';
import { StudentsService } from '../students/students.service';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { CreateSousDossierDto } from './dto/create-sous-dossier.dto';
import { CreateFichierDto } from './dto/create-fichier.dto';
export declare class NewStructureController {
    private readonly dossiersService;
    private readonly sousDossiersService;
    private readonly fichiersService;
    private readonly studentsService;
    constructor(dossiersService: DossiersService, sousDossiersService: SousDossiersService, fichiersService: FichiersService, studentsService: StudentsService);
    createDossier(createDossierDto: CreateDossierDto, req: any): Promise<import("./entities/dossier.entity").Dossier>;
    findAllDossiers(): Promise<import("./entities/dossier.entity").Dossier[]>;
    findDossiersForStudent(req: any): Promise<import("./entities/dossier.entity").Dossier[]>;
    findOneDossier(id: string): Promise<import("./entities/dossier.entity").Dossier>;
    updateDossier(id: string, updateData: Partial<CreateDossierDto>, req: any): Promise<import("./entities/dossier.entity").Dossier>;
    removeDossier(id: string, req: any): Promise<{
        message: string;
    }>;
    createSousDossier(createSousDossierDto: CreateSousDossierDto, req: any): Promise<import("./entities/sous-dossier.entity").SousDossier>;
    findSousDossiersByDossier(dossierId: string): Promise<import("./entities/sous-dossier.entity").SousDossier[]>;
    findSousDossiersForStudent(id: string, req: any): Promise<import("./entities/sous-dossier.entity").SousDossier[]>;
    findOneSousDossier(id: string): Promise<import("./entities/sous-dossier.entity").SousDossier>;
    updateSousDossier(id: string, updateData: Partial<CreateSousDossierDto>, req: any): Promise<import("./entities/sous-dossier.entity").SousDossier>;
    removeSousDossier(id: string, req: any): Promise<{
        message: string;
    }>;
    createFichier(createFichierDto: CreateFichierDto, req: any): Promise<import("./entities/fichier.entity").Fichier>;
    findFichiersBySousDossier(sousDossierId: string): Promise<import("./entities/fichier.entity").Fichier[]>;
    findFichiersForStudent(id: string, req: any): Promise<import("./entities/fichier.entity").Fichier[]>;
    findOneFichier(id: string): Promise<import("./entities/fichier.entity").Fichier>;
    updateFichier(id: string, updateData: Partial<CreateFichierDto>, req: any): Promise<import("./entities/fichier.entity").Fichier>;
    removeFichier(id: string, req: any): Promise<{
        message: string;
    }>;
    downloadFichier(id: string, res: Response, req: any): Promise<void>;
    uploadFichier(file: Express.Multer.File, title: string, description: string, sousDossierId: string, req: any): Promise<import("./entities/fichier.entity").Fichier>;
}
