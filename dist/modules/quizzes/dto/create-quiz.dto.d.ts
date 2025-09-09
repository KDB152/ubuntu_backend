export declare class CreateQuizDto {
    title: string;
    description?: string;
    subject: string;
    duration?: number;
    status?: 'Publié' | 'Brouillon' | 'Archivé';
    is_time_limited?: boolean;
    allow_retake?: boolean;
    show_results?: boolean;
    target_groups?: string[];
}
