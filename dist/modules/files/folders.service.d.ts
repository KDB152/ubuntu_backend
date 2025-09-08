import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { FileFolder } from './entities/file-folder.entity';
import { File } from './entities/file.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AddFileToFolderDto } from './dto/add-file-to-folder.dto';
export declare class FoldersService {
    private foldersRepository;
    private fileFoldersRepository;
    private filesRepository;
    constructor(foldersRepository: Repository<Folder>, fileFoldersRepository: Repository<FileFolder>, filesRepository: Repository<File>);
    create(createFolderDto: CreateFolderDto, createdBy: number): Promise<Folder>;
    findAll(): Promise<Folder[]>;
    findByParent(parentId: number | null): Promise<Folder[]>;
    findOne(id: number): Promise<Folder>;
    update(id: number, updateFolderDto: UpdateFolderDto): Promise<Folder>;
    remove(id: number): Promise<void>;
    addFilesToFolder(folderId: number, addFileToFolderDto: AddFileToFolderDto): Promise<void>;
    removeFileFromFolder(folderId: number, fileId: number): Promise<void>;
    getFolderContents(folderId: number): Promise<{
        folders: Folder[];
        files: File[];
    }>;
    getFolderTree(): Promise<Folder[]>;
}
