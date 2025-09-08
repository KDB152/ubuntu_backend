import { Repository } from 'typeorm';
import { Dossier } from './entities/dossier.entity';
import { CreateDossierDto } from './dto/create-dossier.dto';
export declare class DossiersService {
    private dossiersRepository;
    constructor(dossiersRepository: Repository<Dossier>);
    create(createDossierDto: CreateDossierDto): Promise<Dossier>;
    findAll(): Promise<Dossier[]>;
    findOne(id: number): Promise<Dossier>;
    update(id: number, updateData: Partial<CreateDossierDto>): Promise<Dossier>;
    remove(id: number): Promise<void>;
}
