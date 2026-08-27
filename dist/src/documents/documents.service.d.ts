import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
export declare class DocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private transformDoc;
    findAll(query?: {
        folderId?: string;
        tag?: string;
        search?: string;
    }): Promise<any[]>;
    getAllTags(): Promise<{
        name: string;
        count: number;
    }[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateDocumentDto): Promise<any>;
    update(id: string, dto: UpdateDocumentDto): Promise<any>;
    remove(id: string): Promise<{
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
    }>;
}
