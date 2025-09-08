import { SousDossier } from './sous-dossier.entity';
export declare class Fichier {
    id: number;
    title: string;
    sous_dossier_id: number;
    description: string;
    file_name: string;
    stored_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    download_count: number;
    created_at: Date;
    updated_at: Date;
    sous_dossier: SousDossier;
}
