import { User } from '../../users/entities/user.entity';
import { FileFolder } from './file-folder.entity';
export declare class Folder {
    id: number;
    name: string;
    description: string;
    parentId: number;
    createdBy: number;
    isGlobal: boolean;
    targetClasses: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    creator: User;
    parent: Folder;
    children: Folder[];
    fileFolders: FileFolder[];
}
