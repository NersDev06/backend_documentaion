import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './dto/folder.dto';
export declare class FoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    getTree(): Promise<{
        tree: any[];
        allFolders: ({
            documents: {
                id: string;
                updatedAt: Date;
                order: number;
                createdAt: Date;
                title: string;
                slug: string;
                tags: string;
                folderId: string;
            }[];
        } & {
            id: string;
            updatedAt: Date;
            name: string;
            icon: string | null;
            order: number;
            createdAt: Date;
            parentId: string | null;
        })[];
        rootDocuments: {
            id: string;
            updatedAt: Date;
            order: number;
            createdAt: Date;
            title: string;
            slug: string | null;
            packages: string | null;
            theory: string;
            codePractice: string;
            codeLanguage: string;
            fileName: string | null;
            codeFiles: string | null;
            notes: string | null;
            tags: string | null;
            folderId: string | null;
        }[];
    }>;
    findAll(): Promise<({
        _count: {
            children: number;
            documents: number;
        };
    } & {
        id: string;
        updatedAt: Date;
        name: string;
        icon: string | null;
        order: number;
        createdAt: Date;
        parentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        children: ({
            documents: {
                id: string;
                updatedAt: Date;
                order: number;
                createdAt: Date;
                title: string;
                slug: string | null;
                packages: string | null;
                theory: string;
                codePractice: string;
                codeLanguage: string;
                fileName: string | null;
                codeFiles: string | null;
                notes: string | null;
                tags: string | null;
                folderId: string | null;
            }[];
        } & {
            id: string;
            updatedAt: Date;
            name: string;
            icon: string | null;
            order: number;
            createdAt: Date;
            parentId: string | null;
        })[];
        documents: {
            id: string;
            updatedAt: Date;
            order: number;
            createdAt: Date;
            title: string;
            slug: string | null;
            packages: string | null;
            theory: string;
            codePractice: string;
            codeLanguage: string;
            fileName: string | null;
            codeFiles: string | null;
            notes: string | null;
            tags: string | null;
            folderId: string | null;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        name: string;
        icon: string | null;
        order: number;
        createdAt: Date;
        parentId: string | null;
    }>;
    create(createFolderDto: CreateFolderDto): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        icon: string | null;
        order: number;
        createdAt: Date;
        parentId: string | null;
    }>;
    update(id: string, updateFolderDto: UpdateFolderDto): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        icon: string | null;
        order: number;
        createdAt: Date;
        parentId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        icon: string | null;
        order: number;
        createdAt: Date;
        parentId: string | null;
    }>;
}
