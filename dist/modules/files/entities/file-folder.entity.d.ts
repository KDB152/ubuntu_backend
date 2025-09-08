import { File } from './file.entity';
import { Folder } from './folder.entity';
export declare class FileFolder {
    id: number;
    fileId: number;
    folderId: number;
    createdAt: Date;
    file: File;
    folder: Folder;
}
