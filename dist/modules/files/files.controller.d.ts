import { Response } from 'express';
import { FilesService } from './files.service';
import { FoldersService } from './folders.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AddFileToFolderDto } from './dto/add-file-to-folder.dto';
import { File } from './entities/file.entity';
export declare class FilesController {
    private readonly filesService;
    private readonly foldersService;
    constructor(filesService: FilesService, foldersService: FoldersService);
    create(createFileDto: CreateFileDto, req: any): Promise<File>;
    uploadFile(file: Express.Multer.File, title: string, description: string, req: any): Promise<{
        success: boolean;
        file: File;
        filePath: string;
    }>;
    findAll(req: any): Promise<File[]>;
    getStats(req: any): Promise<{
        totalFiles: number;
        totalDownloads: number;
    }>;
    download(id: string, res: Response, req: any): Promise<void>;
    update(id: string, updateFileDto: UpdateFileDto, req: any): Promise<File>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    createFolder(createFolderDto: CreateFolderDto, req: any): Promise<import("./entities/folder.entity").Folder>;
    getFolders(req: any): Promise<import("./entities/folder.entity").Folder[]>;
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
    debugFolders(req: any): Promise<{
        user: any;
        hasAuth: boolean;
        role: any;
        headers: any;
    }>;
    getFoldersPublic(): Promise<import("./entities/folder.entity").Folder[]>;
    getFolderTree(req: any): Promise<import("./entities/folder.entity").Folder[]>;
    getFolder(id: string, req: any): Promise<import("./entities/folder.entity").Folder>;
    getFolderContents(id: string, req: any): Promise<{
        folders: import("./entities/folder.entity").Folder[];
        files: File[];
    }>;
    updateFolder(id: string, updateFolderDto: UpdateFolderDto, req: any): Promise<import("./entities/folder.entity").Folder>;
    removeFolder(id: string, req: any): Promise<{
        message: string;
    }>;
    addFilesToFolder(id: string, addFileToFolderDto: AddFileToFolderDto, req: any): Promise<{
        message: string;
    }>;
    removeFileFromFolder(folderId: string, fileId: string, req: any): Promise<{
        message: string;
    }>;
    findOne(id: string, req: any): Promise<File>;
}
