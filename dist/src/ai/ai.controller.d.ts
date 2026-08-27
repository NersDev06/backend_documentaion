import { AiService } from './ai.service';
declare class GenerateDocDto {
    prompt: string;
    folderId?: string;
}
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generate(dto: GenerateDocDto): Promise<import("./ai.service").GeneratedDocResult>;
}
export {};
