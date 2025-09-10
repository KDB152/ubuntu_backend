import { RendezVousService } from './rendez-vous.service';
export declare class RendezVousController {
    private readonly rendezVousService;
    constructor(rendezVousService: RendezVousService);
    getRendezVous(req: any, parentId?: string, status?: string): Promise<import("./entities/rendez-vous.entity").RendezVous[]>;
    updateRendezVous(id: string, updateData: {
        status: string;
        adminReason?: string;
        updatedAt?: string;
    }, req: any): Promise<import("./entities/rendez-vous.entity").RendezVous>;
    deleteRendezVous(id: string, req: any): Promise<{
        message: string;
    }>;
}
