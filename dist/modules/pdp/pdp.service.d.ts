import { Repository } from 'typeorm';
import { Pdp } from './entities/pdp.entity';
import { User } from '../users/entities/user.entity';
export declare class PdpService {
    private pdpRepository;
    private userRepository;
    private readonly uploadPath;
    constructor(pdpRepository: Repository<Pdp>, userRepository: Repository<User>);
    uploadProfilePicture(userId: number, file: Express.Multer.File): Promise<Pdp>;
    getProfilePicture(userId: number): Promise<Pdp | null>;
    deleteProfilePicture(userId: number): Promise<void>;
    getProfilePicturePath(userId: number): Promise<string | null>;
    getProfilePictureUrl(userId: number): Promise<string | null>;
}
