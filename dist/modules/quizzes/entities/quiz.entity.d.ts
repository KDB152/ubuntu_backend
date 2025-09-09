export type QuizStatus = 'Publié' | 'Brouillon' | 'Archivé';
export declare class Quiz {
    id: number;
    title: string;
    description?: string;
    subject: string;
    level?: string;
    duration: number;
    attempts: number;
    average_score: number;
    status: QuizStatus;
    is_time_limited: boolean;
    allow_retake: boolean;
    show_results: boolean;
    target_groups?: string[];
    created_at: Date;
    updated_at: Date;
}
