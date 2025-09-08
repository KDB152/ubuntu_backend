import { SousDossier } from './sous-dossier.entity';
export declare class Dossier {
    id: number;
    name: string;
    description: string;
    target_class: string;
    created_at: Date;
    updated_at: Date;
    sous_dossiers: SousDossier[];
}
