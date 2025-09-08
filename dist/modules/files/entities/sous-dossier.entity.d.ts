import { Dossier } from './dossier.entity';
import { Fichier } from './fichier.entity';
export declare class SousDossier {
    id: number;
    name: string;
    dossier_id: number;
    description: string;
    sous_dossier_id: number;
    created_at: Date;
    updated_at: Date;
    dossier: Dossier;
    parent: SousDossier;
    children: SousDossier[];
    fichiers: Fichier[];
}
