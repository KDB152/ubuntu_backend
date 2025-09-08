import { FoldersService } from './folders.service';
export declare class PublicFoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    getFolders(): Promise<import("./entities/folder.entity").Folder[]>;
}
