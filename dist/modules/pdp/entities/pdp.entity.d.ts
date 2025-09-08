import { User } from '../../users/entities/user.entity';
export declare class Pdp {
    id: number;
    userId: number;
    fileName: string;
    storedName: string;
    filePath: string;
    fileType: 'JPEG' | 'PNG' | 'SVG' | 'GIF' | 'WebP';
    fileSize: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
