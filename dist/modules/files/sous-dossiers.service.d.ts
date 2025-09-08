import { Repository } from 'typeorm';
import { SousDossier } from './entities/sous-dossier.entity';
import { CreateSousDossierDto } from './dto/create-sous-dossier.dto';
export declare class SousDossiersService {
    private sousDossiersRepository;
    constructor(sousDossiersRepository: Repository<SousDossier>);
    create(createSousDossierDto: CreateSousDossierDto): Promise<SousDossier>;
    findByDossier(dossierId: number): Promise<SousDossier[]>;
    findOne(id: number): Promise<SousDossier>;
    update(id: number, updateData: Partial<CreateSousDossierDto>): Promise<SousDossier>;
    remove(id: number): Promise<void>;
}
