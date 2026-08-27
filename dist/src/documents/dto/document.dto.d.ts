export declare class CreateDocumentDto {
    title: string;
    slug?: string;
    packages?: string;
    theory: string;
    codePractice: string;
    codeLanguage?: string;
    fileName?: string;
    codeFiles?: any;
    notes?: string;
    tags?: string;
    folderId?: string | null;
    order?: number;
}
export declare class UpdateDocumentDto {
    title?: string;
    slug?: string;
    packages?: string;
    theory?: string;
    codePractice?: string;
    codeLanguage?: string;
    fileName?: string;
    codeFiles?: any;
    notes?: string;
    tags?: string;
    folderId?: string | null;
    order?: number;
}
