import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { IsString, IsOptional } from 'class-validator';

class GenerateDocDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  folderId?: string;
}

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  generate(@Body() dto: GenerateDocDto) {
    return this.aiService.generateDocumentation(dto.prompt, dto.folderId);
  }
}
