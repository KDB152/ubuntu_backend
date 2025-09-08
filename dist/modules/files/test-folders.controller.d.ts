import { FoldersService } from './folders.service';
export declare class TestFoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    testFolders(): Promise<{
        success: boolean;
        count: number;
        folders: import("./entities/folder.entity").Folder[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        count?: undefined;
        folders?: undefined;
    }>;
}
