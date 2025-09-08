import { RendezVousService } from './rendez-vous.service';
export declare class RendezVousController {
    private readonly rendezVousService;
    constructor(rendezVousService: RendezVousService);
    getRendezVous(req: any, parentId?: string, status?: string): Promise<import("./entities/rendez-vous.entity").RendezVous[]>;
}
