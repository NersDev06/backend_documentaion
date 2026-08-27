import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    findAll(folderId?: string, tag?: string, search?: string): Promise<any[]>;
    getAllTags(): Promise<{
        name: string;
        count: number;
    }[]>;
    findOne(id: string): Promise<any>;
    create(createDocumentDto: CreateDocumentDto): Promise<any>;
    update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<any>;
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
