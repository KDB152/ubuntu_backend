import { Repository } from 'typeorm';
import { RendezVous } from './entities/rendez-vous.entity';
export declare class RendezVousService {
    private rendezVousRepository;
    constructor(rendezVousRepository: Repository<RendezVous>);
    getRendezVousByParentId(parentId: string, status?: string): Promise<RendezVous[]>;
    getAllRendezVous(status?: string): Promise<RendezVous[]>;
    getRendezVousById(id: number): Promise<RendezVous>;
}
