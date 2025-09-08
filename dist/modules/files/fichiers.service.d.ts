import { Repository } from 'typeorm';
import { Fichier } from './entities/fichier.entity';
import { CreateFichierDto } from './dto/create-fichier.dto';
export declare class FichiersService {
    private fichiersRepository;
    constructor(fichiersRepository: Repository<Fichier>);
    create(createFichierDto: CreateFichierDto): Promise<Fichier>;
    findBySousDossier(sousDossierId: number): Promise<Fichier[]>;
    findOne(id: number): Promise<Fichier>;
    update(id: number, updateData: Partial<CreateFichierDto>): Promise<Fichier>;
    remove(id: number): Promise<void>;
    incrementDownloadCount(id: number): Promise<void>;
}
