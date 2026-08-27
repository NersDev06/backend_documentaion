export interface GeneratedDocResult {
    title: string;
    folderName: string;
    packages: string;
    theory: string;
    codePractice: string;
    fileName: string;
    codeLanguage: string;
    notes: string;
    tags: string;
}
export declare class AiService {
    generateDocumentation(prompt: string, folderId?: string): Promise<GeneratedDocResult>;
}
