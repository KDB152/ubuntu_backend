import { Student } from '../../students/entities/student.entity';
import { Parent } from '../../parents/entities/parent.entity';
export declare class Payment {
    id: number;
    student_id: number;
    parent_id: number;
    seances_total: number;
    seances_non_payees: number;
    seances_payees: number;
    montant_total: number;
    montant_paye: number;
    montant_restant: number;
    prix_seance: number;
    statut: string;
    date_derniere_presence: Date;
    date_dernier_paiement: Date;
    date_creation: Date;
    date_modification: Date;
    student: Student;
    parent: Parent;
}
